import React, {Component} from 'react';
import {Button, Form, FormControl} from "react-bootstrap";
import './Components.css';
import Download from "./Download";
import axios from "axios";

class SearchEngine extends Component {

    constructor(props){
        super(props);
        this.state = {
            caseInsensitive: false,
            partialMatch: false,
            term: null,
            data:[]
        }
    }

    search = async (e) => {
        e.preventDefault();
        const term = e.target.elements.userInput.value;
        const username = e.target.elements.userInput.value;
        this.setState({
            term
        })
        // console.log(term);

        /** send the term to back end */
        axios.post('http://localhost:5000/custom', {term})
            .then((res)=>{
                console.log(res.data);
                // console.log('Pass term to back end!');
            });

        const api_call = await fetch(`http://localhost:5000/admin/${term}`);
        const data = await api_call.json();
        console.log(data);

        // axios.get('http://localhost:5000/admin', {params: {wordname: this.state.term}})
        //     .then((res)=>{
        //         console.log(res.data);
        //         // console.log('Pass term to back end!');
        //     })
        // axios.get('http://localhost:5000/admin')
        //     // pass term as /admin/term
        //     .then((res)=>{
        //         console.log(res.data);
        //         // console.log('Pass term to back end!');
        //     })
    }

    checkCase = () => {
        this.setState({
            caseInsensitive: !this.state.caseInsensitive,
        })
        console.log(this.state.caseInsensitive);
    }

    checkMatch = () => {
        this.setState({
            partialMatch: !this.state.partialMatch,
        })
        console.log(this.state.partialMatch);
    }

    render() {
        return (
            <div>
                <h2>My Custom Search Engine</h2>

                <div className="checkbox">
                    <label><input type="checkbox" name="case" onChange={this.checkCase}/> Case Insensitive </label>
                    <label><input type="checkbox" name="match" onChange={this.checkMatch}/> Allow Partial Match </label>
                </div>


                <Form className="search" onSubmit={this.search}>
                    <FormControl className="mr-sm-1 searchBar" type="text" placeholder="Type a word to Search." name="userInput"/>
                    <Button id="searchBtn" variant="btn btn-light purple-btn" type="submit">Search</Button>
                </Form>

                <Download data={this.state.data} />

                <h3> Search Result: {this.state.term}</h3>

                /** when click search button
                    pass the term to backend, insert into search table/ done
                    query the page table. find all the entries with certain words.
                    display the result
                    download the result
                */

            </div>
        )
    }
}

export default SearchEngine;