'use client';

import {useState} from 'react';

export const useForm = (InitialObj = {}) =>{
  const [form, setForm] = useState(InitialObj)
  
  const changed = (e) => {
    const {name, value} = e.target;
    setForm({
        ...form,
        [name]: value
    });
  }

  return { form, changed, setForm }
};

