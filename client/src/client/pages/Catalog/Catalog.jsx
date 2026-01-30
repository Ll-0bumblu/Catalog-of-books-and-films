import { useState } from 'react';
import {sortDataFromFilters} from './utils'

import Modal from '../../components/Modal/Modal';
import Header from '../../components/Header/Header'
import List from '../../components/List/List'
import Filter from '../../components/Filter/Filter'
import AddForm from '../../components/AddForm/AddForm'

import appLogo from '../../../assets/app-logo.svg'
import userLogo from '../../../assets/user-logo.png'
import addLogo from '../../../assets/plus-icon.png'


import './Catalog.css'

const appName = "Каталог фильмов и книг";

export default function Catalog() {
  const [filter, setFilter] = useState({type: "all", rating: "all"})
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState(
    [
    { 
      id: 1, 
      type: "book",
      name: 'Карточка 1', 
      note: 'Текст карточки 1',
      date: "26.08.2021",
      rating: "5"
    
    },
    { 
      id: 2, 
      type: "book",
      name: 'Карточка 2', 
      note: 'Текст карточки 2',
      date: "26.08.2021",
      rating: "5"
    },
    { 
      id: 3, 
      type: "movie",
      name: 'Карточка 3', 
      note: 'Текст карточки 3',
      date: "26.08.2021",
      rating: "3",
    },
    { 
    id: 4, 
    type: "movie",
    name: 'Карточка 3', 
    note: 'Текст карточки 3',
    date: "26.08.2021",
    rating: "3",
    },
    { 
    id: 5, 
    type: "movie",
    name: 'Карточка 3', 
    note: 'Текст карточки 3',
    date: "26.08.2021",
    rating: "3",
    },
    ]
  )

  function addItem(newItem) {
    setContent([newItem, ...content])
  }

  function handleTypeChange(type) {
      setFilter({...filter, type: type})
  }

  function handleRatingChange(ratingValue) {
      setFilter({...filter, rating: ratingValue})
  }

  return (
      <section className='catalog'>
        <Header appName={appName} appLogo={appLogo} userName="Вася" userLogo={userLogo} />
        <Filter filter={filter} handleTypeChange={handleTypeChange} handleRatingChange={handleRatingChange}/>

        <List 
          content={sortDataFromFilters(content, filter)} 
          setContent={setContent}
        />

        <button className='add-btn'>
          <img src={addLogo} alt="add" className='add-img' onClick={() => setOpen(!open)}/>
        </button>

        <Modal 
          isOpen={open} 
          onClose={() => setOpen(!open)} 
          children={<AddForm 
            changeItem={addItem}
          />
        }
        />
      </section>
  )
}
