
import { translationKeys } from "../../Localization/International/english";
import * as Yup from "yup";

export const chat_system = [

{
    name: "chat",
    path: "chat",
    icon: "pi pi-comments", // Replaced "fa fa-comments"
    label: translationKeys.Chat|| "messaging",
    menuGroup: translationKeys.Chat,
    menuGroupIcon: "pi pi-comments", // Replaced "fa fa-comments"
    resourceGroup: translationKeys.Chat || "Chat",
    renderMode: "chat",
}

]