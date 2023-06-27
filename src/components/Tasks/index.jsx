import React from 'react';
import pencilPng from '../../assets/icons/pencil.png';
import './Tasks.scss';
import axios from 'axios';
import AddTaskForm from './AddTaskForm';
import Task from './Task';
import { NavLink } from 'react-router-dom/dist';

const Tasks = ({ 
  list,
  onEditTitle,
  onAddTask,
  onRemoveTask,
  onEditTask,
  onCompleteTask,
  withoutEmpty 
}) => {
  const editTitle = () => {
	  const newTitle = window.prompt('Название списка', list.name);
	    if (newTitle) {
		    onEditTitle(list.id, newTitle);
		    axios
        .patch('https://my-json-server.typicode.com/SevHope/todo-app/lists/' + list.id, {
		    name: newTitle
		    })
      }
  };
  return (
    <div className="tasks">
      <NavLink to={`/lists/${list.id}`}>
      <h2 style={{ color: list.color.hex }} className="tasks__title">
        {list.name}
        <img onClick={editTitle} src={pencilPng} alt="Edit icon" />
      </h2>
      </NavLink>
      <div className="tasks__items">
      {!withoutEmpty && list.tasks && !list.tasks.length && (
        <h2>Задачи отсутствуют</h2>
      )}
      {list.tasks && list.tasks.map(task => (
        <Task
          key={task.id}
          list={list}
          onEdit={onEditTask}
          onRemove={onRemoveTask}
          onComplete={onCompleteTask}
          {...task}
        />
      ))}
      <AddTaskForm key={list.id} list={list} onAddTask={onAddTask} />
      </div>
    </div>
  );
};

export default Tasks;
