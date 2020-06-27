import React, { Component } from "react";
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import AuthContext from "../context/auth-context";


class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.titleEl = React.createRef();
    this.priceEl = React.createRef();
    this.dateEl = React.createRef();
    this.descriptionEl = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  static contextType = AuthContext;

  state = {
    creating: false,
    events: []
  };

  startCreateEventHandler = () => {
    this.setState({creating: true});
  }

  modelConfirmHandler = () => {
    this.setState({creating: false});
    const title = this.titleEl.current.value;
    const price = +this.priceEl.current.value;
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
      return;
    }

    const event = {title, price, date, description};
    console.log(event);

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };

    const token = this.context.token;
    console.log(token);
    // fetch will return promise and so the err will be of networking issues rather than backend errors.
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    }).then(resData => {
      console.log(resData);
      this.fetchEvents();
    }).catch(err => {
      console.log(err);
    });

  };

  modelCancelHandler = () => {
    this.setState({ creating: false });
  };

  fetchEvents() {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `
    };

    // fetch will return promise and so the err will be of networking issues rather than backend errors.
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    }).then(resData => {
      const events = resData.data.events;
      this.setState({events: events});
    }).catch(err => {
      console.log(err);
    });
  }    

  render() {
    const eventList = this.state.events.map(event => {
      return <li key={event._id} className="events_list-item">{event.title}</li>;
    });
    return (
      <React.Fragment>
      {this.state.creating && <Backdrop />}
      {this.state.creating && <Modal title = "Add Event" canCancel canConfirm onCancel={this.modelCancelHandler} onConfirm={this.modelConfirmHandler}>
        <form>
          <div className = "form-control">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" ref={this.titleEl}></input>
          </div>
          <div className="form-control">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" ref={this.priceEl}></input>
          </div>
          <div className="form-control">
            <label htmlFor="date">Date</label>
            <input type="datetime-local" id="date" ref={this.dateEl}></input>
          </div>
          <div className="form-control">
            <label htmlFor="description">description</label>
            <textarea id="description" rows="4" ref={this.descriptionEl}></textarea> 
          </div>
        </form>
      </Modal>}
      {this.context.token && (<div className="events-control">
        <p>Share your Events!</p>
        <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
      </div>)}
      <ul className="events_list">
        {eventList}
      </ul>
      </React.Fragment>
    );
  }
}

export default EventsPage;
