<template>
  <div class="mt-12">
    <v-card elevation="1">
      <v-card-title>
        Panel Admins
        <v-spacer></v-spacer>
        <v-btn
          color="blue"
          raised
          small
          tile
          @click="
            openAdminDialog(
              {
                id: -1,
                name: '',
                username: '',
                password: '',
                confirmPassword: '',
                isSuperAdmin: false,
              },
              'create'
            )
          "
          ><v-icon left>mdi-account-plus</v-icon>Add Panel Admin</v-btn
        >
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-data-table
          :headers="headers"
          :items="admins"
          sort-by="id"
          :search="search"
          :loading="isLoading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:item.isSuperAdmin="{ item }">
            {{ item.isSuperAdmin ? 'Yes' : 'No' }}
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              color="blue"
              raised
              small
              tile
              @click="
                openAdminDialog(
                  {
                    id: item.id,
                    name: item.name,
                    username: item.username,
                    password: '',
                    confirmPassword: '',
                    isSuperAdmin: item.isSuperAdmin,
                  },
                  'edit'
                )
              "
              ><v-icon left>mdi-pencil</v-icon>Edit</v-btn
            >
            <v-btn color="red" raised small tile @click="deleteAdmin(item)"
              ><v-icon left>mdi-delete</v-icon> Delete</v-btn
            >
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <template>
      <div>
        <v-dialog v-model="adminDialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
          <v-card tile>
            <v-toolbar flat dark color="primary">
              <v-btn icon dark @click="closeAdminDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title
                >{{ this.adminDialogType[0].toUpperCase() + this.adminDialogType.substr(1) }} admin</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-toolbar-items> <v-btn dark text @click="saveAdmin"> Save </v-btn></v-toolbar-items>
            </v-toolbar>
            <v-card-text>
              <v-form v-model="canSubmitAdmin">
                <v-list three-line subheader>
                  <v-subheader>Admin details</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Name</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          :rules="adminNameRules"
                          :value="currentAdmin.name"
                          @input="update(currentAdmin, 'name', $event)"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Username</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          :rules="adminUsernameRules"
                          :value="currentAdmin.username"
                          @input="update(currentAdmin, 'username', $event)"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Password</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          :value="currentAdmin.password"
                          @input="update(currentAdmin, 'password', $event)"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Confirm Password</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          :value="currentAdmin.confirmPassword"
                          @input="update(currentAdmin, 'confirmPassword', $event)"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Is super admin?</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-checkbox
                          v-model="currentAdmin.isSuperAdmin"
                          color="blue"
                          :value="currentAdmin.isSuperAdmin"
                        ></v-checkbox>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-form>
            </v-card-text>

            <div style="flex: 1 1 auto"></div>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <v-snackbar v-model="notification" bottom left color="blue" :timeout="notificationDuration">
      <v-icon color="white">mdi-check-bold</v-icon>
      {{ notificationText }}
    </v-snackbar>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'PanelAdminsPage',

  data() {
    return {
      headers: [
        { text: '#', value: 'id' },
        { text: 'In-Game Name', value: 'name' },
        { text: 'Username', value: 'username' },
        { text: 'Is Super Admin?', value: 'isSuperAdmin' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      admins: [],
      search: '',
      isLoading: true,
      notification: false,
      notificationText: 'The panel admins lists has been updated',
      notificationDuration: 3000,
      timer: null,

      // Admins
      currentAdmin: {
        id: -1,
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        isSuperAdmin: false,
      },
      canSubmitAdmin: false,
      adminDialog: false,
      adminDialogType: 'none',
      adminNameRules: [
        (value) => !!value || 'Required.',
        (value) => (value || '').length <= 32 || 'Max 32 characters',
        (value) => (value || '').length >= 3 || 'Min 3 characters',
      ],
      adminUsernameRules: [
        (value) => !!value || 'Required.',
        (value) => (value || '').length <= 32 || 'Max 32 characters',
        (value) => (value || '').length >= 3 || 'Min 3 characters',
        (value) =>
          /^[a-zA-Z0-9.]+$/i.test(value) ||
          'Username can only have lathin alplabet characters, numbers and a dot in them!',
      ],
    };
  },

  methods: {
    // Quick work around because v-model does not work with object properties
    update(obj, prop, value) {
      Vue.set(obj, prop, value);
    },

    getHeaders() {
      return {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.getters['session/getToken']}`,
        },
      };
    },

    async confirmAction(action, adminName) {
      return new Promise((resove, reject) => {
        this.$swal({
          title: `Do you really want to ${action} admin ${adminName}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, I do',
        }).then((result) => resove(result.isConfirmed));
      });
    },

    async confirmNotification(text, type) {
      return new Promise((resove, reject) => {
        this.$swal({
          title: text,
          icon: type,
          showCancelButton: false,
          showCloseButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((result) => resove(result.isConfirmed));
      });
    },

    async doAction(action, data) {
      try {
        let result;

        if (action === 'create') {
          result = await Vue.axios.post(`${Vue.config.baseURL}/user/add`, data, this.getHeaders());
        } else if (action === 'edit') {
          result = await Vue.axios.put(`${Vue.config.baseURL}/user/${data.id}`, data, this.getHeaders());
        } else {
          result = await Vue.axios.delete(`${Vue.config.baseURL}/user/${data.id}`, this.getHeaders());
        }

        let resultObject = result.data.user;

        if (resultObject) {
          this.$swal({
            icon: 'success',
            title: `Succesfully ${action === 'delete' ? 'delet' : action}ed the admin!`,
          });

          return resultObject;
        } else {
          this.$swal({
            icon: 'error',
            title: result.data.error
              ? `Failed to ${action} the admin!<br />Error: ${result.data.error}`
              : `Failed to ${action} the admin!`,
          });

          return false;
        }
      } catch (error) {
        if (error.response) {
          console.log('Error: ', error.response);

          this.$swal({
            icon: 'error',
            title: `${error.response.data.error}`,
          });
        } else if (error.request) {
          console.log('Error: ', error.request);

          this.$swal({
            icon: 'error',
            title: 'Unable to connect to the server!',
          });
        } else {
          // Something happened in setting up of the request that triggered an Error
          console.log('Error: ', error.message);

          this.$swal({
            icon: 'error',
            title: 'Code error, open the console for more info!',
          });
        }

        return false;
      }
    },

    openAdminDialog(admin, type) {
      this.currentAdmin = Object.assign({}, admin);
      this.adminDialog = true;
      this.adminDialogType = type;
    },

    closeAdminDialog() {
      (this.currentAdmin = {
        id: -1,
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
        isSuperAdmin: false,
      }),
        (this.adminDialog = false);
      this.adminDialogType = 'none';
    },

    async deleteAdmin(admin) {
      if ((await this.confirmAction('delete', admin.name)) === true) {
        const returnedAdmin = await this.doAction('delete', admin);

        if (returnedAdmin) this.admins = this.admins.filter((admin_) => admin_.id !== returnedAdmin.id);
      }
    },

    async saveAdmin() {
      if ((await this.confirmAction(this.adminDialogType, this.currentAdmin.name)) === true) {
        if (!this.canSubmitAdmin) {
          await this.confirmNotification('Admin name or username is not valid!');
          return;
        }

        let returnedAdmin = await this.doAction(this.adminDialogType, this.currentAdmin);

        if (returnedAdmin !== false) {
          if (this.adminDialogType === 'edit')
            this.admins = this.admins.filter((admin_) => admin_.id !== returnedAdmin.id);

          this.admins.push(returnedAdmin);
          this.closeAdminDialog();
        }
      }
    },
  },

  async mounted() {
    try {
      this.isLoading = true;
      await this.$store.dispatch('users/fetch');
      this.admins = this.$store.getters['users/getUsers'];
      this.isLoading = false;
      this.notification = true;
    } catch (error) {
      await this.confirmNotification('Could not load the admins!', 'error');
    }
  },
};
</script>
