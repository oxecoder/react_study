import React from 'react';
import './App.css';

const useSemiPersistentState = (key, initialState) => {
  /**
   * searchTerm represents the current state
   * setSearchTerm function to update this state
   * useState returns an array with a state and a function
   * useState uses array destructuring to assign each value/function to a variable more concisely
   */
  /**
   * life state up so that it can be shared with other components
   */
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  )

  /**
   * since the key comes from outside, the custom hook assusmes that it could change,
   * so it needs to be included in the dependency array of the useEffect hook.
   * Without it, the side-effect may run with an outdated key
   */
  React.useEffect(() => {
    // function where the side-effect ocuures
    localStorage.setItem(key, value)
  }, // array of variables, which if one of the variables changes the function for the side-effect is called. 
    [value, key])

  return [value, setValue]
}


/**
 * used to implement React components
 */
const App = () => {

  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1
    }
  ]

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')

  const handleSearch = event => {
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))


  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id='search'
        label='Search'
        value={searchTerm}
        onInputChange={handleSearch}
      />

      {/* <Search search={searchTerm} onSearch={handleSearch} /> */}
      <hr />

      <List list={searchedStories} />
      <List list={searchedStories} />
    </div>
  )
}

const InputWithLabel = ({ id, label, value, type = 'text', onInputChange }) => (
  <>
    <label htmlFor={id}>{label}</label>
    &nbsp;
    <input
      id={id}
      type={type}
      value={value}
      onChange={onInputChange}
    />
  </>
)

// const Search = ({ search, onSearch }) => (
//   <>
//     <label htmlFor='search'>Search: </label>
//     <input
//       id='search'
//       type='text'
//       value={search}
//       onChange={onSearch} />
//   </>
// )

const List = ({ list }) =>
  list.map(item => <Item key={item.objectID} item={item} />)

const Item = ({ item }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </div>
)

export default App;
