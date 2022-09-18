import { render, screen } from '@testing-library/react';
import renderer from 'react-test-renderer';
import App, { Item, List, InputWithLabel } from './App';

/**
 * unit testing
 * integration testing
 * end to end testing
 */

// test suite
describe('something truthy', () => {
  // test case
  it('true to be true', () => {
    //assertion
    expect(true).toBe(true);
  });

  it('false to be false', () => {
    expect(false).toBe(false)
  })
});


describe('Item', () => {
  const item = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  }

  it('renders all properties', () => {
    const component = renderer.create(<Item item={item} />)

    expect(component.root.findByType('a').props.href).toEqual(item.url)
  })

  it('calls onRemoveItem on button click', () => {
    // fn() returns a mock for the actual function
    const handleRemoveItem = jest.fn()
    const component = renderer.create(
      <Item item={item} onRemoveItem={handleRemoveItem} />
    )

    component.root.findByType('button').props.onClick()

    expect(handleRemoveItem).toHaveBeenCalledTimes(1)
    expect(handleRemoveItem).toHaveBeenCalledWith(item)

    expect(component.root.findAllByType(item).length).toEqual(0)

  })
})
