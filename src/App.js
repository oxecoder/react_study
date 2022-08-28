import React from 'react';
import './App.css';

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

  /**
   * searchTerm represents the current state
   * setSearchTerm function to update this state
   * useState returns an array with a state and a function
   * useState uses array destructuring to assign each value/function to a variable more concisely
   */
  /**
   * life state up so that it can be shared with other components
   */
  const [searchTerm, setSearchTerm] = React.useState('React')

  const handleSearch = event => {
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))


  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search search={searchTerm} onSearch={handleSearch} />
      <hr />

      <List list={searchedStories} />
      <List list={searchedStories} />
    </div>
  )
}

const Search = ({ search, onSearch }) => (
  <div>
    <label htmlFor='search'>Search: </label>
    <input
      id='search'
      type='text'
      value={search}
      onChange={onSearch} />
  </div>
)


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
