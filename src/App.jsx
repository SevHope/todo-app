import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, useLocation, useNavigate} from 'react-router-dom/dist';
import { List, AddList, Tasks } from './components';
import allTasks from './assets/icons/allTasks.png';

function App() {
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    axios
      .get('https://my-json-server.typicode.com/SevHope/todo-app/lists?_expand=color&_embed=tasks')
      .then(({ data }) => {
        setLists(data);
      });
    axios
      .get('https://my-json-server.typicode.com/SevHope/todo-app/colors').then(({ data }) => {
        setColors(data);
      });
  }, []);

  const onAddList = (obj) => {
    const newList = [...lists, obj];
    setLists(newList);
  };

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map(item => {
      if (item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
    return item;
    });
    setLists(newList);
  };

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt('Текст задачи', taskObj.text);
    if (!newTaskText) {
      return;
    }

  const newList = lists.map(list => {
    if (list.id === listId) {
      list.tasks = list.tasks.map(task => {
        if (task.id === taskObj.id) {
          task.text = newTaskText;
        }
        return task;
      });
    }
    return list;
  });
    setLists(newList);
    axios
      .patch('https://my-json-server.typicode.com/SevHope/todo-app/tasks/' + taskObj.id, {
        text: newTaskText
      })
  };

  const onRemoveTask = (listId, taskId) => {
    if (window.confirm('Вы действительно хотите удалить задачу?')) {
      const newList = lists.map(item => {
        if (item.id === listId) {
          item.tasks = item.tasks.filter(task => task.id !== taskId);
        }
        return item;
      });
      setLists(newList);
      axios.delete('https://my-json-server.typicode.com/SevHope/todo-app/tasks/' + taskId)
    }
  };

  const onCompleteTask = (listId, taskId, completed) => {
    const newList = lists.map(list => {
      if (list.id === listId) {
        list.tasks = list.tasks.map(task => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    axios
      .patch('https://my-json-server.typicode.com/SevHope/todo-app/tasks/' + taskId, {
        completed
      })
  };

  const onEditListTitle = (id, title) => {
    const newList = lists.map(item => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setLists(newList);
  };
  useEffect(() => {
    const listId = location.pathname.split('lists/')[1];
      if (lists) {
        const list = lists.find(list => list.id === Number(listId));
        setActiveItem(list);
      }
  }, [lists, location.pathname]);
  <List
    onClickItem={list => {
    navigate('/')
    }}
  />
  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
        onClickItem={list => {
          navigate(`/`);
        }}
        items={[
          {
            active: true,
            icon: <img src={allTasks} width="80px" alt="listIcon" />,
            name: 'Все задачи',
          },
        ]}
        />
        {lists ? (
          <List
            items={lists}
            onRemove={id => {
              const newLists = lists.filter(item => item.id !== id);
              setLists(newLists);
            }}
            onClickItem={list => {
              navigate(`/lists/${list.id}`);
            }}
            activeItem={activeItem}
            isRemovable
          />
        ) : (
          'Загрузка...'
        )}
        <AddList onAdd={onAddList} colors={colors} />
      </div>
      <div className="todo__tasks">
        <Routes>
        <Route 
          exact path='' 
          element={lists && lists.map(list => 
        <Tasks 
          key={list.id}
          list={list} 
          onAddTask={onAddTask}
          onEditTitle={onEditListTitle}
          onRemoveTask={onRemoveTask}
          onEditTask={onEditTask}
          onCompleteTask={onCompleteTask}
          withoutEmpty
          />)}>
        </Route>
        <Route 
          exact path='/lists/:id' 
          element={lists && activeItem && 
        <Tasks 
          list={activeItem} 
          onAddTask={onAddTask}
          onEditTitle={onEditListTitle}
          onRemoveTask={onRemoveTask}
          onEditTask={onEditTask}
          onCompleteTask={onCompleteTask} />
        }></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
