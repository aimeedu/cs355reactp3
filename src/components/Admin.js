import React, {Component} from 'react';
import './Admin.css';
import {Button, Form, FormControl} from "react-bootstrap";
import axios from 'axios';


class Admin extends Component {
    constructor(props){
        super(props);
        this.state = {
            SearchData:[],
            IndexingData:[],
            isIndexed: false,
            count:0
        }
    }

    // make AJAX calls, query the data from the search table. http://localhost:3000 or 5000/admin, both working
    // as soon as you click on fetch data button, the table will show.
    fetchSearchHistories = async () => {
        /** when we use postgresql this code works
        const res = await fetch('/admin');
        const results = await res.json();
        this.setState({
            results
        }) */
        // below is for mongodb get search result.
        axios.get('http://localhost:5000/custom')
            .then(res => {
                this.setState({
                    SearchData: res.data
                })
                console.log(res.data);
            })
    }

    fetchIndexingHistories = async () => {
        // below is for mongodb get search result.
        axios.get('http://localhost:5000/admin')
            .then(res => {
                this.setState({
                    IndexingData: res.data
                })
                console.log(res.data);
            })
    }

    indexing = (e) => {
        e.preventDefault();
        // get the user input url
        const inputURL = e.target.elements.userInput.value;
        // console.log(inputURL);

        /** pass this url to the post function.*/
        axios.post('http://localhost:5000/admin', {inputURL})
            .then((res)=>{
                console.log(res.data);
                console.log('Indexing Successfully! Data inserted in DB!');
            })
        this.setState({
            isIndexed: true,
            count: this.state.count+1
        })
    }

    render() {

        const Searchrows = this.state.SearchData.map((SearchData, i) => {
            return(
                <tr key={i}>
                    <td>{SearchData.searchid}</td>
                    <td>{SearchData.term}</td>
                    <td>{SearchData.count}</td>
                    <td>{SearchData.createdAt}</td>
                    <td>{SearchData.timetosearch}</td>
                </tr>
            )
        })

        const Indexingrows = this.state.IndexingData.map((IndexingData, i) => {
            return(
                <tr key={i}>
                    <td>{IndexingData._id}</td>
                    <td>{IndexingData.url}</td>
                    <td>{IndexingData.title}</td>
                    <td>{IndexingData.description}</td>
                    <td>{IndexingData.createdAt}</td>
                    <td>{IndexingData.timetosearch}</td>
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

                <h3>User Search Histories <button type="button" className="btn btn-outline-light" onClick={this.fetchSearchHistories}>Fetch Data</button></h3>
                <table className="">
                    <thead>
                        <tr>
                            <th>Search ID</th>
                            <th>Terms</th>
                            <th>Number of search results</th>
                            <th>Created At</th>
                            <th>Searching Time</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Searchrows}
                    </tbody>
                </table>
                <br/>

                <h3>Indexing Histories <button type="button" className="btn btn-outline-light" onClick={this.fetchIndexingHistories}>Fetch Data</button></h3>
                <table className="">
                    <thead>
                    <tr>
                        <th>Indexing ID</th>
                        <th>URL</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Created At</th>
                        <th>Indexing Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Indexingrows}
                    </tbody>
                </table>

            </div>
        );
    }
}

export default Admin;