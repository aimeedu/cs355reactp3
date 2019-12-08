import React, {Component} from 'react';
import './Admin.css';
import {Button, Form, FormControl} from "react-bootstrap";
import axios from 'axios';


class Admin extends Component {
    constructor(props){
        super(props);
        this.state = {
            results:[],
            isIndexed: false,
            count:0
        }
    }

    // make AJAX calls, query the data from the search table. http://localhost:3000 or 5000/admin, both working
    // as soon as you click on fetch data button, the table will show.
    fetchHistories = async () => {
        const res = await fetch('/admin');
        const results = await res.json();
        this.setState({
            results
        })
    }

    indexing = (e) => {
        e.preventDefault();
        // get the user input url
        const inputURL = e.target.elements.userInput.value;
        console.log(inputURL);

        //pass this url to the post function.
        axios.post('/admin', {inputURL})
            .then((res)=>{
                console.log(res.data);
                console.log('Indexing Successfully! Data inserted in DB!');
            })
        this.setState({
            isIndexed: true,
            count: this.state.count+1
        })

    //     const request = new Request('http://localhost:3000/admin', {
    //         method: 'POST',
    //         headers: new Headers({'Content-Type': 'application/json'}),
    //         body: inputURL
    //     })
    //     // //xmlhttprequest
    //     fetch(request)
    //         .then((res) => {
    //             res.json()
    //                 .then((data)=>{
    //                     console.log(data)
    //                 })
    //         })
    }

    render() {

        const rows = this.state.results.map((result, i) => {
            return(
                <tr key={i}>
                    <td>{result.searchid}</td>
                    <td>{result.terms}</td>
                    <td>{result.count}</td>
                    <td>{result.searchdate}</td>
                </tr>
            )
        })

        return (
            <div>
                <h2>Indexing Launcher</h2>
                <h3>{this.state.isIndexed?`Data inserted into DB! Indexing Count: ${this.state.count}`:null}</h3>
                <Form className="search" onSubmit={this.indexing}>
                    <FormControl className="mr-sm-1 searchBar" type="url" placeholder="Type a URL to be indexed." name="userInput"/>
                    <Button id="searchBtn" variant="btn btn-light purple-btn" type="submit">Search</Button>
                </Form>


                <br/><br/>

                   <h3>User Search Histories <button type="button" className="btn btn-outline-light" onClick={this.fetchHistories}>Fetch Data</button>
                   </h3>

                <table className="">
                    <thead>
                        <tr>
                            <th>Search ID</th>
                            <th>Terms</th>
                            <th>Number of search results</th>
                            <th>Searching Time</th>
                        </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
                <br/>
            </div>
        );
    }
}

export default Admin;