import React from 'react';
import './App.css';
export { InputWithLabel, List, Item }

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

const initialStories = [
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

const getAsyncStories = () =>
  new Promise(resolve =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  )

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      }
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.filter(
          story => action.payload.objectID !== story.objectID
        )
      }
    default:
      throw new Error()
  }
}


/**
 * used to implement React components
 */
const App = () => {

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  )

  React.useEffect(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' })

    getAsyncStories().then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.stories

      })
    }).catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }))
  }, [])

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    })
  }

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React')

  const handleSearch = event => {
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.data.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()))


  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id='search'
        isFocused={false}
        label='Search'
        value={searchTerm}
        onInputChange={handleSearch} >
        Search
      </InputWithLabel>

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      }

    </div>
  )
}

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children
}) => {
  const inputRef = React.useRef()

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  )
}

const List = ({ list, onRemoveItem }) =>
  list.map(item =>
    <Item
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
  )

const Item = ({ item, onRemoveItem }) => {
  const handleRemoveItem = () => {
    onRemoveItem(item)
  }

  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type='button' onClick={handleRemoveItem}>
          Dismiss
        </button>
      </span>
    </div>
  )
}

export default App;
