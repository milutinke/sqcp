<template>
  <div class="mt-12">
    <v-card elevation="1">
      <v-card-title> Server Roles and Admins </v-card-title>

      <v-card-text>
        <v-card>
          <v-card-title>
            Roles
            <v-spacer></v-spacer>
            <v-btn
              color="blue"
              raised
              small
              tile
              @click="openRoleDialog({ name: 'NewRole', permissions: '' }, 'create')"
              ><v-icon left>mdi-file-plus</v-icon>Add Role</v-btn
            >
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="searchRoles"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              :headers="headersRoles"
              :items="roles"
              sort-by="id"
              :search="searchRoles"
              :loading="isLoading"
              loading-text="Loading... Please wait"
            >
              <template v-slot:item.permissions="{ item }">
                <v-chip
                  tile
                  label
                  class="ma-1"
                  v-for="(perm, index) of item.permissions.split(',')"
                  :key="perm"
                  text-color="white"
                  small
                  :color="getPermissionColor(perm)"
                >
                  {{ perm }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn color="blue" raised small tile @click="openRoleDialog(item, 'edit')"
                  ><v-icon left>mdi-pencil</v-icon>Edit</v-btn
                >
                <v-btn color="red" raised small tile @click="deleteRole(item)"
                  ><v-icon left>mdi-delete</v-icon> Delete</v-btn
                >
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>
            Admins
            <v-spacer></v-spacer>
            <v-btn
              color="blue"
              raised
              small
              tile
              @click="openAdminDialog({ name: 'New Admin', steamID: '', roleId: -1 }, 'create')"
              ><v-icon left>mdi-account-plus</v-icon>Add Admin</v-btn
            >
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="searchAdmins"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              :headers="headersAdmins"
              :items="admins"
              sort-by="id"
              :search="searchAdmins"
              :loading="isLoading"
              loading-text="Loading... Please wait"
            >
              <template v-slot:item.name="{ item }">
                <a
                  :href="'http://steamcommunity.com/profiles/' + item.steamID"
                  class="linkDecoration"
                  target="_blank"
                  >{{ item.name }}</a
                >
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn color="blue" raised small tile @click="openAdminDialog(item, 'edit')"
                  ><v-icon left>mdi-pencil</v-icon>Edit</v-btn
                >
                <v-btn color="red" raised small tile @click="deleteAdmin(item)"
                  ><v-icon left>mdi-delete</v-icon> Delete</v-btn
                >
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="notification" bottom left color="blue" :timeout="notificationDuration">
      <v-icon color="white">mdi-check-bold</v-icon>
      {{ notificationText }}
    </v-snackbar>

    <template>
      <div>
        <v-dialog v-model="roleDialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
          <v-card tile>
            <v-toolbar flat dark color="primary">
              <v-btn icon dark @click="closeRoleDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title
                >{{ this.roleDialogType[0].toUpperCase() + this.roleDialogType.substr(1) }} role</v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-toolbar-items> <v-btn dark text @click="saveRole"> Save </v-btn></v-toolbar-items>
            </v-toolbar>
            <v-card-text>
              <v-list three-line subheader>
                <v-subheader>Role details</v-subheader>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Name</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-form v-model="canSubmitRole">
                        <v-text-field
                          :rules="roleNameRules"
                          :value="currentRole.name"
                          @input="update(currentRole, 'name', $event)"
                        ></v-text-field>
                      </v-form>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <v-list three-line subheader>
                <v-subheader>Role permissions</v-subheader>

                <v-list-item v-for="(perm, index) of permissions" :key="index">
                  <v-list-item-action>
                    <v-checkbox
                      v-model="currentRole.permissions"
                      :color="getPermissionColor(perm)"
                      :value="perm"
                    ></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ perm }}</v-list-item-title>
                    <v-list-item-subtitle>{{ getPermissionDesription(perm) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>

            <div style="flex: 1 1 auto"></div>
          </v-card>
        </v-dialog>
      </div>
    </template>

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
                      <v-list-item-title>Steam ID</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-text-field
                          :rules="adminSteamIdRules"
                          :value="currentAdmin.steamID"
                          @input="update(currentAdmin, 'steamID', $event)"
                        ></v-text-field>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Role</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-select
                          :items="roles"
                          item-text="name"
                          item-value="id"
                          label="Select a role"
                          v-model="currentAdmin.roleId"
                        ></v-select>
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
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'ServerRoles',

  data() {
    return {
      // Headers
      headersRoles: [
        { text: '#', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Permissions', value: 'permissions' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      headersAdmins: [
        { text: '#', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Steam ID 64', value: 'steamID' },
        { text: 'Role', value: 'Role.name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      // Avaliable permissions
      permissions: [
        'changemap',
        'cheat',
        'private',
        'balance',
        'chat',
        'kick',
        'ban',
        'config',
        'cameraman',
        'immune',
        'manageserver',
        'reserve',
        'debug',
        'pause',
        'featuretest',
        'forceteamchange',
        'canseeadminchat',
        'startvote',
        'teamchange',
      ],

      // Data for the tables
      roles: [],
      admins: [],

      // Search
      searchRoles: '',
      searchAdmins: '',

      // Loading
      isLoading: true,
      notification: false,
      notificationText: 'The roles and admin lists have been updated',
      notificationDuration: 3000,
      timer: null,

      // Role
      currentRole: {
        id: -1,
        name: '',
        permissions: [],
      },
      canSubmitRole: false,
      roleDialog: false,
      roleDialogType: 'none',
      roleNameRules: [
        (value) => !!value || 'Required.',
        (value) => (value || '').length <= 32 || 'Max 32 characters',
        (value) => (value || '').length >= 3 || 'Min 3 characters',
        (value) => /^[a-zA-Z]+$/i.test(value) || 'Name must contain only English alphabet letters!',
      ],

      // Admins
      currentAdmin: {
        id: -1,
        name: '',
        steamID: '',
        roleId: -1,
      },
      canSubmitAdmin: false,
      adminDialog: false,
      adminDialogType: 'none',
      adminNameRules: [
        (value) => !!value || 'Required.',
        (value) => (value || '').length <= 64 || 'Max 64 characters',
        (value) => (value || '').length >= 3 || 'Min 3 characters',
      ],
      adminSteamIdRules: [
        (value) => !!value || 'Required.',
        (value) => /^\d{17}$/i.test(value) || 'Steam ID 64 must be excactly 17 numbers!',
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

    getPermissionColor(perm) {
      const colors = {
        changemap: 'light-green',
        cheat: 'red accent-3',
        private: 'pink darken-1',
        balance: 'purple lighten-3',
        chat: 'blue',
        kick: 'orange darken-1',
        ban: 'red',
        config: 'red lighten-1',
        cameraman: 'green darken-3',
        immune: 'lime darken-3',
        manageserver: 'red darken-4',
        reserve: 'deep-purple',
        debug: 'purple darken-4',
        pause: 'indigo',
        featuretest: 'purple darken-1',
        forceteamchange: 'teal darken-3',
        canseeadminchat: 'cyan lighten-1',
        startvote: 'brown lighten-1',
        teamchange: 'blue-grey',
      };

      return !colors[perm] ? 'blue' : colors[perm];
    },

    getPermissionDesription(perm) {
      const permissionDescriptions = {
        changemap: 'Allows the admin to change the map/layer',
        cheat: 'Allows the admin to use server cheat commands',
        private: 'Allows the admin to password protect the server',
        balance: 'Allows the admin not to be affected by server team balancing',
        chat: 'Allows the admin to chat in the Admin chat and to broadcast',
        kick: 'Allows the admin to kick players',
        ban: 'Allows the admin to ban players',
        config: 'Allows the admin to change the server configuration',
        cameraman: 'Allows the admin to enter into the camera mode',
        immune: 'Admins with this permissions can not be banned or kicked by other admins',
        manageserver: 'Allows the admin to shut down the server',
        reserve: 'Allows the admin to have reserved slot',
        debug: 'Show admin stats command and other debugging info',
        pause: 'Allows the admin to Pause the server gameplay',
        featuretest: 'Any features added for testing by dev team (Devs only)',
        forceteamchange: "Allows the admin to execute the 'ForceTeamChange' command",
        canseeadminchat: 'Allows the admin to see the admin chat and teamkill/admin-join notifications',
        startvote: 'Allows admin to start a vote (Not implemented!)',
        teamchange: 'No timer limits on team change',
      };

      return !permissionDescriptions[perm] ? 'No Description' : permissionDescriptions[perm];
    },

    openRoleDialog(role, type) {
      this.currentRole = Object.assign({}, role);
      this.currentRole.permissions = role.permissions.split(',');
      this.roleDialog = true;
      this.roleDialogType = type;
    },

    closeRoleDialog() {
      this.currentRole = {
        id: -1,
        name: '',
        permissions: [],
      };
      this.roleDialog = false;
      this.roleDialogType = 'none';
    },

    async confirmAction(module, action, roleName) {
      return new Promise((resove, reject) => {
        this.$swal({
          title: `Do you really want to ${action} ${module} ${roleName}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, I do',
        }).then((result) => resove(result.isConfirmed));
      });
    },

    async confirmNotification(text) {
      return new Promise((resove, reject) => {
        this.$swal({
          title: text,
          icon: 'error',
          showCancelButton: false,
          showCloseButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
        }).then((result) => resove(result.isConfirmed));
      });
    },

    async doAction(module, action, data) {
      try {
        let result;

        if (action === 'create') {
          result = await Vue.axios.post(`${Vue.config.baseURL}/server/${module}s`, data, this.getHeaders());
        } else if (action === 'edit') {
          result = await Vue.axios.put(`${Vue.config.baseURL}/server/${module}s/${data.id}`, data, this.getHeaders());
        } else {
          result = await Vue.axios.delete(`${Vue.config.baseURL}/server/${module}s/${data.id}`, this.getHeaders());
        }

        let resultObject = module === 'role' ? result.data.role : result.data.admin;

        if (resultObject) {
          this.$swal({
            icon: 'success',
            title: `Succesfully ${action === 'delete' ? 'delet' : action}ed the ${module}!`,
          });

          return resultObject;
        } else {
          this.$swal({
            icon: 'error',
            title: result.data.error
              ? `Failed to ${action} the ${module}!<br />Error: ${result.data.error}`
              : `Failed to ${action} the ${module}!`,
          });

          return false;
        }
      } catch (error) {
        if (error.response) {
          //console.log('Error: ', error.response);

          this.$swal({
            icon: 'error',
            title: `${error.response.data.error}`,
          });
        } else if (error.request) {
          //console.log('Error: ', error.request);

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

    async deleteRole(role) {
      if (
        (await this.confirmAction('role (this will delete all admins with this role)', 'delete', role.name)) === true
      ) {
        const returnedRole = await this.doAction('role', 'delete', role);

        if (returnedRole) {
          this.roles = this.roles.filter((role_) => role_.id !== returnedRole.id);
          this.admins = this.admins.filter((admin_) => admin_.Role.id !== returnedRole.id);
        }
      }
    },

    async saveRole() {
      if ((await this.confirmAction('role', this.roleDialogType, this.currentRole.name)) === true) {
        if (!this.canSubmitRole || this.currentRole.permissions.length === 0) {
          await this.confirmNotification(
            !this.canSubmitRole ? 'Role name is not valid!' : 'You must select at least one permission!'
          );

          return;
        }

        const formatedRoleObject = Object.assign({}, this.currentRole);
        formatedRoleObject.permissions = this.rolesArrayToString(this.currentRole.permissions);

        let returnedRole = await this.doAction('role', this.roleDialogType, formatedRoleObject);

        if (returnedRole !== false) {
          if (this.roleDialogType === 'edit') this.roles = this.roles.filter((role_) => role_.id !== returnedRole.id);

          this.roles.push(returnedRole);
          this.closeRoleDialog();
        }
      }
    },

    rolesArrayToString(roles) {
      let text = '';

      for (let i = 0; i < roles.length; i++) text += `${roles[i]},`;

      text = text.trim();

      if (text[0] === ',') text = text.substr(1);
      if (text[text.length - 1] === ',') text = text.substr(0, text.length - 1);

      return text;
    },

    openAdminDialog(admin, type) {
      this.currentAdmin = Object.assign({}, admin);
      this.currentAdmin.roleId = this.currentAdmin.RoleId;
      this.adminDialog = true;
      this.adminDialogType = type;
    },

    closeAdminDialog() {
      this.currentAdmin = {
        id: -1,
        name: '',
        steamID: '',
        roleId: -1,
      };

      this.adminDialog = false;
      this.adminDialogType = 'none';
    },

    async deleteAdmin(admin) {
      if ((await this.confirmAction('admin', 'delete', admin.name)) === true) {
        const returnedAdmin = await this.doAction('admin', 'delete', admin);

        if (returnedAdmin) {
          this.admins = this.admins.filter((admin_) => admin_.id !== returnedAdmin.id);
        }
      }
    },

    async saveAdmin() {
      if (this.currentAdmin.RoleId) this.currentAdmin.RoleId = undefined;

      if (this.currentAdmin.Role) this.currentAdmin.Role = undefined;

      console.log(JSON.stringify(this.currentAdmin, null, 4));

      if ((await this.confirmAction('admin', this.adminDialogType, this.currentAdmin.name)) === true) {
        if (!this.canSubmitAdmin || this.currentAdmin.role === -1) {
          await this.confirmNotification(
            !this.canSubmitAdmin ? 'Admin name or steam id is not valid!' : 'You must select the admin role!'
          );

          return;
        }

        let returnedAdmin = await this.doAction('admin', this.adminDialogType, this.currentAdmin);

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
    this.isLoading = true;
    await this.$store.dispatch('serverRoles/fetchRoles');
    await this.$store.dispatch('serverRoles/fetchAdmins');
    this.roles = this.$store.getters['serverRoles/getRoles'];
    this.admins = this.$store.getters['serverRoles/getAdmins'];
    this.isLoading = false;
    this.notification = true;
  },
};
</script>

<style scoped>
.linkDecoration {
  text-decoration: none;
}
</style>
