import React, {Component} from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import Firebase from './components/firebase';
import {PuffLoader} from 'react-spinners';

class App extends Component {
  constructor(props){
    super(props);
      this.state = {
        todoList:[],
        activeItem:{
          id:null, 
          title:'',
        },
        editing:false,
        loader:false,
        name: localStorage.getItem('name') || null, //username
        userid: localStorage.getItem('userid') || null, //userid
      }

      this.fetchData = this.fetchData.bind(this) //fetch todo data
      this.tododata = Firebase.getTodo() //Todolist data from firebase
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)

      this.startEdit = this.startEdit.bind(this)
      this.deleteItem = this.deleteItem.bind(this)
      this.strikeUnstrike = this.strikeUnstrike.bind(this)
      this.Logout = this.Logout.bind(this)
  };

  componentWillMount(){
    this.fetchData();
  }

  async Logout(){
    await Firebase.logout()
    .then(() => {
      document.location.reload();
    })
  }

  fetchData(){
    this.tododata.then((res) => {
      console.log(res)
      res.filter(user => user.userid === this.userid ).map(todo => {

        //
        this.setState(state => {

          const list = state.todoList.push(todo);

          return{
            list,
            ...this.state
          }

        });
      //
        
      })
      //
      this.setState({loader : true});
      //
    })
  }


  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    console.log('Name:', name)
    console.log('Value:', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
    
  }

  handleSubmit(e){
    e.preventDefault();

    console.log('ITEM:', this.state.activeItem);

    if (!this.state.editing) {
        Firebase.createTodo(this.state.activeItem.title);
        this.setState({activeItem : {
            title : ''
         }
        });
        setTimeout(() => window.location.reload(), 1000);
    }else{
        Firebase.strikeTodo(localStorage.getItem('id'), localStorage.getItem('completed'), localStorage.getItem('uid'), localStorage.getItem('title'));
        setTimeout(() => window.location.reload(), 3200);
    }

  }

  startEdit(task, id, completed, uid){
    this.setState({
      activeItem: {
        title : task
      },
      editing:true,
    })

    localStorage.setItem('id', id); //id
    localStorage.setItem('completed', completed); //completed
    localStorage.setItem('uid', uid); //uid
  }


  deleteItem(id){
    //delete
    Firebase.deleteTodo(id);
    setTimeout(() => window.location.reload(), 3200);
  }


  strikeUnstrike(id, completed, uid, title){
    
    let complete = false;

    if(completed){

        complete = false;
      
    }else{

         complete = true;
      
    }
    console.log(complete)

    Firebase.strikeTodo(id, complete, uid, title);
    setTimeout(() => window.location.reload(), 3200);
    
    
  }


  render(){
    var tasks = this.state.todoList;
    var self = this;
    localStorage.setItem('title', this.state.activeItem.title);
    
    return(
        <>
          <div className="Auth fadeInDown">
            {this.state.name 
              ?
                <><a className="btn auth" onClick={this.Logout}>Logout</a></>
              :
               <> 
                <a href="http://localhost:3000/identity/register" className="btn auth">SignUp</a>
                <a href="http://localhost:3000/identity/login" className="btn auth">Login</a>
                </>
            }
            

          </div>
          

          <div className="container fadeInDown">

            <div id="task-container">
              {this.state.name ? (
                  <>
                  <div  id="form-wrapper">
                    
                             <form onSubmit={this.handleSubmit}  id="form">
                                <div className="flex-wrapper">
                                    <div style={{flex: 6}}>
                                        <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task.." />
                                     </div>

                                     <div style={{flex: 1}}>
                                        <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                                      </div>
                                  </div>
                            
                            </form>
                          
                 
                  </div>
                  
                  <div id="list-wrapper">   
                    {!this.state.loader ? (
                        <>
                          <div style={{display : 'flex', justifyContent : 'center'}}>
                            <PuffLoader color="rgba(32,152,126,1)" />
                          </div>
                        </>
                      ):(  
                        <>    
                          {tasks.filter(task => task.uid == this.state.userid).map((task, index) => {
                            return(
                                <div key={index} className="task-wrapper flex-wrapper">

                                  <div onClick={() => self.strikeUnstrike(task.id, task.completed, task.uid, task.title)} style={{height : '35px', flex:7}}>

                                      {!task.completed? (
                                           <span>{task.title}</span>

                                         ):( 

                                            <strike>{task.title}</strike>
                                        )}
        
                                  </div>

                                  <div style={{flex:1}}>
                                      <button onClick={() => self.startEdit(task.title, task.id, task.completed, task.uid)} className="btn btn-sm btn-outline-info">Edit</button>
                                  </div>

                                  <div style={{flex:1}}>
                                      <button onClick={() => self.deleteItem(task.id)} className="btn btn-sm btn-outline-dark delete">-</button>
                                  </div>

                                </div>
                              )
                          })}
                        </>
                      )}
                  </div>
                  </>
              

              ):(
                <div  id="form-wrapper">
                      <form onSubmit={(e) => e.preventDefault()}id="form">
                        <div className="flex-wrapper">
                            <div style={{flex: 6}}>
                                <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add task.." />
                             </div>

                             <div style={{flex: 1}}>
                                <a href="http://localhost:3000/identity/login" id="submit" className="btn btn-warning">Submit</a>
                              </div>
                        </div>
                    
                      </form>
                         
                </div>

          )}
             
            </div>
          </div>
        </>
      )
  }
}



export default App;
