<template>
    <div v-if="loading">
        <LoaderAlt />
    </div>
    <div v-else class="h-screen overflow-scroll mt-5 p-6">
        <div class="">
            <DynamicForm :resource="resource" :initial-data="object" :is-adding="isAdding" redirect-to="current"
            />
          
        </div>
    </div>
</template>

<script>
import DynamicForm from "../crud/dynamic_form.vue";
import LoaderAlt from "../../../u_i/sf_loader_alt.vue";
import axios from "axios";
import { translationKeys } from '@/executables/translation';
import themeCustomizer from "../../../theme-customizer.vue";

export default {
    components: { DynamicForm, LoaderAlt, themeCustomizer },
    data() {
        return {
            loading: false,
            object: null,
            isAdding: false,
            translationKeys: translationKeys,
            resource: {
                name: "system-config",
                icon: "fa fa-cog",
                label: translationKeys.SystemConfiguration,
                menuGroup: translationKeys.Settings,
                menuGroupIcon: "fa fa-wrench",
                schema: [
                    {
                        name: "logo",
                        title: translationKeys.SystemLogo,
                        type: "image",
                    },
                    {
                        name: "appName",
                        title: translationKeys.ApplicationName,
                        type: "text",
                    },
                    {
                        name: "appVersion",
                        title: translationKeys.ApplicationVersion,
                        type: "text",
                    },
                    {
                        name: "appLanguage",
                        title: translationKeys.Language,
                        type: "select",
                        options: [
                            {
                                label: "English",
                                value: "en",
                            },
                            {
                                label: "French",
                                value: "fr",
                            },
                            {
                                label: "Spanish",
                                value: "es",
                            },
                            {
                                label: "Portuguese",
                                value: "pt",
                            },
                        ],
                    },
                    {
                        name: "googleConfig",
                        title: translationKeys.GoogleConfiguration,
                        type: "object",
                        schema: [
                            {
                                name: "clientId",
                                title: translationKeys.ClientId,
                                type: "text",
                            },
                            {
                                name: "clientSecret",
                                title: translationKeys.ClientSecret,
                                type: "text",
                            },
                            {
                                name: "userEmail",
                                title: translationKeys.UserEmail,
                                type: "text",
                            },
                            {
                                name: "userPassword",
                                title: translationKeys.UserPassword,
                                type: "text",
                            },
                            {
                                name: "accessToken",
                                title: translationKeys.AccessToken,
                                type: "text",
                            },
                            {
                                name: "refreshToken",
                                title: translationKeys.RefreshToken,
                                type: "text",
                            },
                        ],
                    },
                    {
                        name: "StripeConfig",
                        title: translationKeys.StripeConfiguration,
                        type: "object",
                        schema: [
                            {
                                name: "publishableKey",
                                title: translationKeys.PublishableKey,
                                type: "text",
                            },
                            {
                                name: "secretKey",
                                title: translationKeys.SecretKey,
                                type: "text",
                            },
                        ],
                    },
                    {
                        name: "PaypalConfig",
                        title: translationKeys.PaypalConfiguration,
                        type: "object",
                        schema: [
                            {
                                name: "clientId",
                                title: translationKeys.ClientId,
                                type: "text",
                            },
                            {
                                name: "clientSecret",
                                title: translationKeys.ClientSecret,
                                type: "text",
                            },
                        ],
                    },
                    {
                        name: "JwtConfig",
                        title: translationKeys.JwtConfiguration,
                        type: "object",
                        schema: [
                            {
                                name: "secretKey",
                                title: translationKeys.SecretKey,
                                type: "text",
                            },
                        ],
                    },
                    {
                        name: "databaseConfig",
                        title: translationKeys.DatabaseConfiguration,
                        type: "object",
                        schema: [
                            {
                                name: "databaseURL",
                                title: translationKeys.DatabaseUrl,
                                type: "text",
                            },
                        ],
                    },
                    {
                        name: "FirebaseConfig",
                        title: translationKeys.FirebaseConfiguration,
                        type: "object",
                        schema: [
                            {
                                name: "apiKey",
                                title: translationKeys.ApiKey,
                                type: "text",
                            },
                            {
                                name: "authDomain",
                                title: translationKeys.AuthDomain,
                                type: "text",
                            },
                            {
                                name: "projectId",
                                title: translationKeys.ProjectId,
                                type: "text",
                            },
                            {
                                name: "storageBucket",
                                title: translationKeys.StorageBucket,
                                type: "text",
                            },
                            {
                                name: "messagingSenderId",
                                title: translationKeys.MessagingSenderId,
                                type: "text",
                            },
                            {
                                name: "appId",
                                title: translationKeys.AppId,
                                type: "text",
                            },
                        ],
                    },
                    {
                        name: "TwilioConfig",
                        title: translationKeys.TwilioConfiguration,
                        type: "object",
                        schema: [
                            {
                                name: "accountSid",
                                title: translationKeys.AccountSid,
                                type: "text",
                            },
                            {
                                name: "authToken",
                                title: translationKeys.AuthToken,
                                type: "text",
                            },
                            {
                                name: "twilioNumber",
                                title: translationKeys.TwilioNumber,
                                type: "text",
                            },
                        ],
                    },
                    {
                        name: "s3Config",
                        title: translationKeys.AmazonS3Configuration,
                        type: "object",
                        schema: [
                            { name: "accessKeyId", title: translationKeys.AccessKeyId, type: "text" },
                            { name: "secretAccessKey", title: translationKeys.SecretKey, type: "text" },
                            { name: "bucketName", title: translationKeys.BucketName, type: "text" },
                        ],
                    },
                    {
                        name: "openAIConfig",
                        title: translationKeys.OpenAiConfiguration,
                        type: "object",
                        schema: [{ name: "apiKey", title: translationKeys.ApiKey, type: "text" }],
                    },
                    {
                        name: "loginPageLayout",
                        title: translationKeys.LoginPageLayout,
                        type: "select",
                        options: [
                            {
                                label: "Default Layout",
                                value: "DefaultLayout",
                            },
                            {
                                label: "Split Layout",
                                value: "SplitLayout",
                            },
                        ],
                    },
                    {
                        name: "appDescription",
                        title: translationKeys.ApplicationDescription,
                        type: "richtext",
                    },
                    {
                        name: "maintenanceMessage",
                        title: translationKeys.MaintenanceMessage,
                        type: "richtext",
                    },
                    {
                        name: "maintenanceMode",
                        title: translationKeys.MaintenanceMode,
                        type: "check",
                    },
                ],

                renderMode: "singleton",
            },
        };
    },
    created() {
        this.fetchResource();
    },

    methods: {
        fetchResource() {
            this.loading = true;
            axios
                .get(`${import.meta.env.VITE_APP_API_URL}/api/v1/system-config`)
                .then((response) => {
                    this.object = response.data.data[0];
                    console.log(response.data[0]);
                })
                .catch((error) => {
                    console.error("Error fetching resource:", error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },

};
</script>