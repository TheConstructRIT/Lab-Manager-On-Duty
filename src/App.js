import React, { Component } from 'react';
import Contacts from './components/contacts';
import { Container, Row, Col } from 'shards-react';
import Particles from 'react-particles-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

document.body.style = 'background: #ff8000;';

function generateDateTime() {
  var currentTime = new Date();
  var year = currentTime.getFullYear();
  var month = currentTime.getMonth() + 1;
  var day = currentTime.getDate();
  var hour = currentTime.getHours();
  var minute = currentTime.getMinutes();
  var lowerSeconds = currentTime.getSeconds();
  var uppserSeconds = lowerSeconds + 1;
  var timeOffset = currentTime.getTimezoneOffset() / 60;

  //2020-10-01T09:00:00-04:00
  var MinTime =
    year +
    '-' +
    month +
    '-' +
    day +
    'T' +
    hour +
    ':' +
    minute +
    ':' +
    lowerSeconds +
    '-0' +
    timeOffset +
    ':00';
  var MaxTime =
    year +
    '-' +
    month +
    '-' +
    day +
    'T' +
    hour +
    ':' +
    minute +
    ':' +
    uppserSeconds +
    '-0' +
    timeOffset +
    ':00';
  return [MinTime, MaxTime];
}

//<Contacts  contacts={this.state.contacts} />

class App extends Component {
  render() {
    // TODO: Implement better workaround for 1 lab manager on duty being too big (fix assumes 16:9 displ)
    var maxWidth = '80%';
    if (this.state.contacts.length == 1) {
      maxWidth = '40%';
    }

    return (
      <div>
        <Particles className="particles" params={particlesOptions} />
        <meta httpEquiv="refresh" content="1800" />
        <center>
          <h1>Lab Managers on Duty</h1>
        </center>

        <Container style={{ maxWidth: maxWidth }}>
          <Row>
            {console.log('this.state.contacts')}
            {console.log(this.state.contacts)}
            {this.state.contacts &&
              this.state.contacts.map((contact, indx) => {
                return (
                  <Col>
                    <Contacts contacts={contact} />
                  </Col>
                );
              })}
          </Row>
        </Container>
      </div>
    );
  }

  state = {
    contacts: [],
  };

  updateManagers() {
    const api_key = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;
    const cal_id = process.env.REACT_APP_GOOGLE_CALENDAR_ID;
    var minMaxTime = generateDateTime();
    var url =
      'https://www.googleapis.com/calendar/v3/calendars/' +
      cal_id +
      '/events?key=' +
      api_key +
      '&timeMin=' +
      minMaxTime[0] +
      '&timeMax=' +
      minMaxTime[1] +
      '&Fields=Desicription';
    console.log(url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let employeeArray = data.items;
        let newEmployeeArray = [];
        let addedEmployees = {};
        for (var i = 0; i < employeeArray.length; i++) {
          var employeeData = employeeArray[i];
          var employeeName = employeeData.summary;
          if (
            employeeData.status == 'confirmed' &&
            addedEmployees[employeeName] != true
          ) {
            newEmployeeArray.push(employeeData);
            addedEmployees[employeeName] = true;
          }
        }

        this.setState({ contacts: newEmployeeArray });
      })
      .catch(() => {
        setTimeout(() => {
          this.updateManagers();
        }, 2000);
      });

    console.log(api_key);
    console.log(cal_id);
  }

  componentDidMount() {
    this.updateManagers();

    // Update the lab managers every minute.
    setInterval(() => {
      this.updateManagers();
    }, 60000);
  }
}

export default App;
