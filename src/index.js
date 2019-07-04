import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
const not_found = require('./img/algolia_not_found.png');
let dataTEST = null;
let table = (data, opened, method, refresh) => {
    if(data === null){
      return <div className="loaderBlock"></div>
    }else{
      let tableData = (data.length > 0)?data.map((comp, key) => <div className={(parseInt(key) & 1)?"table chetno":"table"} key={key}>
       <div className="tabledatacont">{comp.key}</div>
       <div className="tabledatacont">{comp.task_title}</div>
       <div className="tabledatacont">{comp.creation_date}</div>
      </div>):<div className="tableFound">
                Data not found!
                <img src={not_found} alt="data not found"/>
              </div>;
       let headInfo = "("+data.length+")"
       return <div className="tableData">
        <div className="tableHead">
          <div className="headInfo">{headInfo}</div>
          <div className="btn" onclick={refresh}>Refresh</div>
          <div className="btn" onClick={method}>Create task</div>
        </div>
        {tableData}
       </div>
    }
}

class ModalNewTask extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loaderThis: false
    }
  }
  thisPostMethodAppDataNewTask(){
    this.setState({loaderThis: true});
    axios.post('http://localhost:3001/setData', {
      taskName: document.getElementById('newTaskName').value
    }).then(res => {
       dataTEST = res.data.data;
       document.getElementById('newTaskName').value = '';
       this.props.method();
       this.setState({loaderThis: false});

    });
  }
  render(){
    return <div className={(this.props.opened)?"modalNewTask":"modalNewTask hide"}>
      <div className="modalContent">
        <div className="newTaskLoader" style={(this.state.loaderThis)?{display:"block"}:{display:"none"}}></div>
        <div className="taskClose" onClick={this.props.method}>Close</div>
        <input type="text" className="inputText" placeholder="write task name" id="newTaskName"/>
        <input type="button" className="inputButton" value="submit" onClick={this.thisPostMethodAppDataNewTask.bind(this)}/>
      </div>
    </div>
  }
}

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dataTable: null,
      openNewTask: false
    }
  }

  refreshTable(){
    this.setState({
      dataTable: null
    });
    axios.post('http://localhost:3001/getData').then(res => {
      dataTEST = res.data.data
       this.setState({
         dataTable: res.data.data
       });
    });
  }
  componentDidMount() {
    this.refreshTable()
  }

  openThisModal(){
    this.setState({
      openNewTask: true
    });
  }

  closedthisModal(){
    this.setState({
      openNewTask: false
    });
  }
  render(){
      return <div className="content">
        {table(dataTEST, this.state.openNewTask, this.openThisModal.bind(this), this.refreshTable.bind(this))}
        <ModalNewTask opened={this.state.openNewTask} method={this.closedthisModal.bind(this)}/>
      </div>
  }
}

ReactDOM.render(<Main/>, document.getElementById('root'));
