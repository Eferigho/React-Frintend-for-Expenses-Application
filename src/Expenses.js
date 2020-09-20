import React, { Component } from 'react';
import AppNav from './AppNav';
import DatePicker from 'react-datepicker';
import './App.css';
import "react-datepicker/dist/react-datepicker.css";
import {Container, Input,Button, Label, Form,FormGroup, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import Moment from 'react-moment'

class Expenses extends Component {

    emptyItem = {
        descript : '',
        expansedate : new Date(),
        id : '101',
        location : '',
        category : {id:1, name:'Travel'}
    }

    constructor(props){
        super();

        this.state = { date: new Date(),
            isLoading : true,
            Expenses : [],
            Categories:[], 
            item : this.emptyItem,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

async handleSubmit(e){
    
    const item = this.state.item;
    await fetch('/api/expenses', {
        method : "POST",
        headers : {
            'Accept' : 'application/josn',
            'Content-Type' : 'application/json'
        }, 
        body : JSON.stringify(item),
    });

    e.preventDefault();
    this.props.history.push("/expenses");
}

handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
    console.log(this.state.item);
}

handleDateChange(date){
    let item = {...this.state.item};
    item.expansedate = date;
    this.setState({item});
    console.log(item.expansedate);
}

async remove(id){
    console.log(id);
    await fetch(`/api/expenses/${id}`,{
        method : 'DELETE',
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    }).then(()=> {
        let updatedExpenses = [...this.state.Expenses].filter(i => i.id !== id);
        this.setState({Expenses : updatedExpenses});
    });
}

async componentDidMount(){ 
    const response = await fetch('/api/categories');
    const body = await response.json();
    this.setState({Categories:body, isLoading:false});

    const responseExp = await fetch('/api/expenses');
    const bodyExp = await responseExp.json();
    this.setState({Expenses:bodyExp, isLoading:false});
    
}
    render() { 
        const title = <h3 className="mt-4">Add Expense</h3>
        const {Categories} = this.state;
        const {Expenses, isLoading} = this.state;

        if(isLoading)
            return(<div>Loading ...</div>)

        let optionList =
            Categories.map(category =>
            <option key={category.id}>
                {category.name}
            </option>
                )

        
// {
//     "id": 104,
//     "descript": "Auchi the crazy Poly",
//     "expansedate": "2020-09-17T03:02:00Z",
//     "location": "Benin",
//     "category": {
//         "id": 1,
//         "name": "Travel",
//         "user": {}
//     }
// }
        let rows =
                Expenses.map(expense =>
                    <tr  key ={expense.id}>
                        <td id = {expense.id}>{expense.descript}</td>
                        <td id = {expense.id}>{expense.location}</td>
                        <td id = {expense.id}><Moment date={expense.expansedate} format="YYYY/MM/DD"/></td>
                        <td id = {expense.id}>{expense.category.name}</td>
                        <td id={expense.id}><Button size="sm" color="danger" onClick = {()=> this.remove(expense.id)}>Delete</Button></td>
                    </tr>)

        return ( 
            <div>
                <AppNav/>
                <Container>
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input type="text" name="descript" id="descript" 
                            onChange ={this.handleChange} autoComplete="name"/>
                        </FormGroup>

                        <FormGroup>
                            <Label for="category">Category</Label>
                            <select>
                                {optionList}
                            </select>
                        </FormGroup>

                        <FormGroup>
                            <Label for="expenseDate">Expense Date</Label>
                            <DatePicker selected={this.state.item.expansedate}
                             onChange ={this.handleDateChange}/>
                        </FormGroup>

                        <div className="row">
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="location">Location</Label>
                                <Input type="text" name="location" id="location" onChange ={this.handleChange}></Input>
                            </FormGroup>
                        </div>

                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Container>

                {' '}
                <Container>
                    <h3>Expense List</h3>
                    <Table>
                        <thead>
                            <tr >
                                <th width="20%">Description</th>
                                <th width="20%">Location</th>
                                <th width="20%">Date</th>
                                <th width="20%">Category</th>
                                <th width="20%">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                </Container>
            </div>
         );
    }
}
 
export default Expenses;