import { ISetting, SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { CryptoVertStrings } from "./CryptoVertStrings";

export namespace CryptoVertSettings {
	// The cryptocompare api key setting
	export const APIKEY: ISetting = {

		id: "APIKEY",
		type: SettingType.STRING,
		packageValue: "", //default value
		value: "",
		public: false, // can standard users see it
		i18nLabel: "customize_api_key",
		i18nDescription: "customize_api_key_description",
		required: true,

	}

	// Which currency to use as default
	export const HOMECURRENCY = {

		id: "HOME",
		type: SettingType.STRING,
		packageValue: "USD", //default value
		value: "USD",
		public: false, // can standard users see it
		i18nLabel: "customize_default_currency",
		i18nDescription: "customize_default_currency_description",
		required: true,

	}
}

