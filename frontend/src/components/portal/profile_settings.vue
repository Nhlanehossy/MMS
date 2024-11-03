<template>
    <div v-if="loading">
        <LoaderAlt />
    </div>
    <div v-else class="container mt-5 p-6">
        
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
            <h2 class="heading">
                {{ translationKeys.UpdateProfile }}
            </h2>
            <DynamicForm :resource="resource" :initial-data="object" :is-adding="isAdding" redirect-to="current"
                class="p-4 shadow-md rounded-md" />
            <h2 class="heading">
                {{ translationKeys.UpdatePassword }}
            </h2>
            <UpdatePassword />
        </div>
    </div>
</template>

<script>
import DynamicForm from "./render_modes/crud/dynamic_form.vue";
import LoaderAlt from "../u_i/sf_loader.vue";
import axios from "axios";
import UpdatePassword from "./update_password.vue";
import { translationKeys } from '@/executables/translation';

export default {
    components: { DynamicForm, LoaderAlt, UpdatePassword },
    data() {
        return {
            loading: false,
            object: null,
            isAdding: false,
            translationKeys: translationKeys,
            resource: {
                "name": "profile",
                "icon": "fa fa-user-cog",
                "label": "Account Settings",

                "schema": [
                    {
                        "image": "Image",
                        "title": translationKeys.ProfilePicture,
                        "type": "image",
                        "required": true
                    },
                    {
                        "name": "fullname",
                        "title": translationKeys.FullName,
                        "type": "text",
                        "required": true
                    },
                    {
                        "name": "email",
                        "title": translationKeys.Email,
                        "type": "email",
                        "required": true
                    },
                    {
                        "name": "phoneNumber",
                        "title": translationKeys.PhoneNumber,
                        "type": "phone",
                        "required": true
                    },

                    {
                        "name": "dateOfBirth",
                        "title": translationKeys.DateOfBirth,
                        "type": "date"
                    },
                    {
                        "name": "description",
                        "title": translationKeys.Description,
                        "type": "richText",
                        "required": true
                    },

                ],

            }
        };
    },
    created() {
        this.fetchResource();
    },

    methods: {
        fetchResource() {
            this.loading = true;
            const id = localStorage.getItem("userId");
            axios
                .get(`${import.meta.env.VITE_APP_API_URL}/api/v1/users/${id}`)
                .then((response) => {
                    this.object = response.data;
                    console.log(response.data);
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