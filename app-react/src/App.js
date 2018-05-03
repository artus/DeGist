import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import * as blockstack from 'blockstack'
import uuid from 'uuid'

class App extends Component {

    state = {
        degists: [],
        degistIds: [],
        authenticated: false
    }

    componentDidMount() {
        if (blockstack.isSignInPending()) {
            blockstack.handlePendingSignIn()
                .then((data) => {
                    this.setState({
                        authenticated: true
                    })
                    this.loadDeGists()
                })
        } else if (blockstack.isUserSignedIn()) {
            this.setState({
                authenticated: true
            })
            console.log('Signed In')
            this.setupUser().then(() => {
                this.loadDeGists()
            })
        }
    }

    loadDeGists = () => {

        blockstack.getFile('degist.json', { decrypt: true })
            .then(file => {
                if (file) {

                    const degistIds = JSON.parse(file).degistIds

                    this.setState({
                        degistIds
                    })
                    this.loadConcreteDeGists(degistIds)

                }

            })
            .catch(console.log)
    }

    loadConcreteDeGists = (degists) => {
        Promise.all(degists.map(degistsId => {
            return blockstack.getFile('degist-' + degistsId + '.json', { decrypt: false })
                .then(JSON.parse)
        }))
            .then(degistObjects => {
                this.setState({
                    degists: degistObjects
                })
            })
    }

    onClick = (evt) => {
        evt.preventDefault()
        if (this.state.authenticated) {
            blockstack.signUserOut('/')
        } else {
            const origin = window.location.origin
            blockstack.redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
        }
    }

    saveDeGists = () => {

        // Construct a new DeGist object
        const newDeGist = {
            id: uuid.v4(),
            title: this.title.value,
            content: this.contents.value,
            date: new Date().toISOString()

        }


        const degistIds = [
            newDeGist.id,
            ...this.state.degistIds
        ]
        const degists = [
            newDeGist,
            ...this.state.degists
        ]

        // Add the new DeGist to the degist.json


        blockstack.putFile('degist.json', JSON.stringify({ degistIds }), { encrypt: true }).catch(console.log)

        // Save the new DeGist
        blockstack.putFile('degist-' + newDeGist.id + '.json', JSON.stringify(newDeGist), { encrypt: false }).catch(console.log)

        this.setState({
            degists,
            degistIds
        })

        // Clear inputs
        this.title.value = ''
        this.contents.value = ''
    }

    render() {

        let btnText = this.state.authenticated ? `Sign out` : 'Sign in'

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <a onClick={this.onClick.bind(this)} className="button is-primary">{btnText}</a>

                {
                    this.state.authenticated ? (
                        <div>
                            <input type="text" name="title" ref={r => this.title = r} />
                            <textarea name="contents" ref={r => this.contents = r} />
                            <button type="submit" onClick={this.saveDeGists}>Save</button>
                        </div>
                    ) : null
                }

                {
                    this.state.degists.map((degist, i) => {
                        return (
                            <div key={i}>
                                <h3>{degist.title}</h3>
                                <h6>{new Date(degist.date).toLocaleDateString()}</h6>
                                <p>{degist.content}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default App
