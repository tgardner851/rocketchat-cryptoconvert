import { IHttp, IModify, IPersistence, IRead, IHttpRequest, HttpStatusCode } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { CryptoVertStrings } from "./CryptoVertStrings";
import { CryptocompareAPI } from "./CryptocompareAPI";

export class CryptoVertConvertCommand implements ISlashCommand {
	public command = 'cryptoconvert';
	public i18nParamsExample = "example_convert";
	public i18nDescription = "example_convert_description";
	public providesPreview = false;

	private re: RegExp;

	constructor(private readonly api: CryptocompareAPI, private home: string) {
		this.re = new RegExp('to|in');
	}

	public async executor(
		context: SlashCommandContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<void> {

		let args = context.getArguments();

		switch (args.length) {

			case 2:
				return await this.currencyConversionHandler(context, read, modify, http,
					{
						amount: args[0],
						from: args[1].toUpperCase(),
						to: this.home
					});

			case 3:
				if (this.re.test(args[2])) {
					return await this.invalidUsageHandler(context, modify);
				}
				else {
					return await this.currencyConversionHandler(context, read, modify, http,
						{
							amount: args[0],
							from: args[1].toUpperCase(),
							to: args[2]
						});
				}

			case 4:
				return await this.currencyConversionHandler(context, read, modify, http,
					{
						amount: args[0],
						from: args[1].toUpperCase(),
						to: args[3].toUpperCase()
					});

			default:
				return await this.invalidUsageHandler(context, modify);
		}
	}

	private async invalidUsageHandler(
		context: SlashCommandContext,
		modify: IModify
	): Promise<void> {

		//TODO use enum for std messages
		await this.sendNotifyMessage(context, modify, CryptoVertStrings.INVALID_COMMAND + CryptoVertStrings.CONVERT_USAGE)
	}

	private async currencyConversionHandler(
		context: SlashCommandContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		data: { amount: string, from: string, to: string }
	): Promise<void> {

		//Get the price from API
		let result = await this.api.getPrice(http, data.from, data.to);

		if (result.Response == "Error") {
			await this.sendNotifyMessage(context, modify, result.Message ? result.Message : CryptoVertStrings.FAILED_FETCH);

		} else {
			//convert the price to the amount
			let conversion = parseInt(data.amount) * result[data.to];
			let message = data.amount + " " + data.from + CryptoVertStrings.EQUAL + "\n" + conversion + " " + data.to;

			await this.sendNotifyMessage(context, modify, message);
		}
	}

	private async sendNotifyMessage(
		context: SlashCommandContext,
		modify: IModify,
		text: string
	): Promise<void> {

		const message = modify.getCreator()
			.startMessage()
			.setGroupable(false)
			.setRoom(context.getRoom())
			.setUsernameAlias(CryptoVertStrings.USERNAME)
			.setSender(context.getSender())
			.setAvatarUrl(CryptoVertStrings.AVATAR_URL)
			.setText(text)
			.getMessage();

		return await modify.getNotifier().notifyRoom(context.getRoom(), message);
	}
}