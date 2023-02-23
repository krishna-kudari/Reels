import React, { ReactNode } from 'react';

interface FormWrapperProps {
   title: string,
   children: ReactNode
}

const FormWrapper : React.FC<FormWrapperProps> = ( {title ,children} ) => {
  return (
    <div className='flex-1 px-6 '>
    <p className="font-bold text-lg  py-2 ">{title}</p>
    {children}
    </div>
  )
}

export default FormWrapper;