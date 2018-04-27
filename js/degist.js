var degistApp = new Vue({
    el: "#degist-app",
    data: {
        blockstack: window.blockstack,
    },
    methods: {
        checkLogin() {
            if (this.blockstack.isSignInPending()) {
                this.blockstack.handlePendingSignIn().then(response => {
                    window.location = "https://artusvranken.github.io/DeGist/";
                });
            }
            else if (this.blockstack.isUserSignedIn()) {
                // User is logged in
            }
        },
        login() {
            this.blockstack.redirectToSignIn(window.location.href, "https://artusvranken.github.io/DeGist/manifest.json", ['store_write', 'publish_data']);
        },
        logout() {
            this.blockstack.signUserOut(window.location.href);
        },
    }
});