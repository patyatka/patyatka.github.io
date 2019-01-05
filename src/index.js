const e = React.createElement;

class Autocomplete extends React.Component {
  constructor(props) {
    super(props)
    this.users = []
    this.state = { 
      filteredUsers: [],
      inputVal: '' 
    }
    this.onInputChange = this.onInputChange.bind(this)
  }

  getUsers() {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
           if (xmlhttp.status == 200) {
              const users = JSON.parse(xmlhttp.responseText)
              this.users = users
              this.setState({filteredUsers: users})
           }
        }
    }

    xmlhttp.open("GET", "https://jsonplaceholder.typicode.com/users", true)
    xmlhttp.send()
  }

  onInputChange(e) {
    const val = e.target.value
    let filteredUsers = this.users.filter(user => {
      const regExp = new RegExp('^' + val, 'i')
      return regExp.test(user.username)
    })

    this.setState({
      inputVal: val, 
      filteredUsers,
      isItemsShown: true 
    })
  }

  setInputVal(val) {
    this.setState({ inputVal: val, isItemsShown: false })
  }

  componentWillMount() {
    this.getUsers()
  }

  render() {
    if (!this.users.length) return 'Loading...'

    return (
      <div className="autocomplete">
        <input 
          id="userInput" 
          type="text" 
          name="user"
          value={this.state.inputVal}
          placeholder="please type user name"
          onChange={this.onInputChange}
        />
        { 
          this.state.isItemsShown && this.state.inputVal && <div className="autocomplete-items">
          { 
            this.state.filteredUsers.map(user => 
              (<div key={user.id} onClick={() => this.setInputVal(user.username)}>
                <strong>{this.state.inputVal}</strong>
                {user.username.substring(this.state.inputVal.length)}
              </div>)
            )
          }
          </div>
        }
      </div>
    )
  }
}

const domContainer = document.querySelector('#app');
ReactDOM.render(e(Autocomplete), domContainer);