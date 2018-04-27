var degistApp = new Vue({
    el: "#degist-app",
    data: {
        blockstack: window.blockstack,

        // DeGists
        degists: new Array(),
        concreteDeGists: new Array(),

        // interpolation strings
        newDeGistInput: "",
        newDeGistTitleInput: "",
        newGistText: "Create a new gist",
    },
    methods: {
        checkLogin() {
            if (this.blockstack.isSignInPending()) {
                this.blockstack.handlePendingSignIn().then(response => {
                    window.location = "https://artusvranken.github.io/DeGist/";
                });
            }
            else if (this.blockstack.isUserSignedIn()) {
                this.loadDeGists();
            }
        },
        login() {
            this.blockstack.redirectToSignIn(window.location.href, "https://artusvranken.github.io/DeGist/manifest.json", ['store_write', 'publish_data']);
        },
        logout() {
            this.blockstack.signUserOut(window.location.href);
        },
        loadDeGists() {
            this.blockstack.getFile('degist.json', { decrypt: true }).then(file => {

                this.degists = JSON.parse(file).degists;
                this.loadConcreteDeGists();

            }).catch(console.log);
        },
        loadConcreteDeGists() {
            for (let deGistId of this.degists) {
                this.blockstack.getFile("degist-" + deGistId + ".json", { decrypt: false }).then(response => {
                    this.loadConcreteDeGists.push(JSON.parse(response));
                }).catch(console.log);
            }
        },
        saveDeGists() {

            // Construct a new DeGist object
            const newDeGist = {

                id: this.generateGUID(),
                title: this.newDeGistTitleInput,
                content: this.newDeGistInput,
                date: new Date().toISOString()

            };

            // Add the new DeGist to the degist.json
            this.degists.push(newDeGist.id);
            this.blockstack.putFile('degist.json', JSON.stringify({ degists: this.degists }), { encrypt: true }).catch(console.log);

            // Save the new DeGist 
            this.blockstack.putFile('degist.json', JSON.stringify(newDeGist), { encrypt: false }).catch(console.log);
            this.concreteDeGists.unshift(newDeGist);

            // Clear inputs
            this.newDeGistInput = "";
            this.newDeGistTitleInput = "";
        },
        generateGUID() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        },
    }
});

degistApp.checkLogin();