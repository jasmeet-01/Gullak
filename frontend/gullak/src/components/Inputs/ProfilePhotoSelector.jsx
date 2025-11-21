import React,{useState,useRef} from 'react';
import {LuUser, LuUpload, LuTrash} from 'react-icons/lu';

const ProfilePhotoSelector = ({image,setImage}) => {
    const inputRef=useRef(null);
    const [previewUrl,setPreviewUrl]=useState(null);

    const handleImageChange=(event)=>{
        const file=event.target.files[0];
        console.log('Selected file:', file);
        if(file){
            //update the image state
            setImage(file);
            //generate preview url
            const preview= URL.createObjectURL(file);
            setPreviewUrl(preview);

        }
    };

    const handleRemoveImage=()=>{
      if (confirm("Do you want to remove the image") == true) {
        setImage(null);
        setPreviewUrl(null);
      }
    };
    const onChooseFile=() =>{
        inputRef.current.click();
    };
  return (
    <div className='flex justify-center mb-6'>
      <input
      type='file'
      accept='image/*'
      ref={inputRef} 
      onChange={handleImageChange}
      className='hidden'
      />
    {image ? (
      <div className='relative'>
        <img
          src={previewUrl}
          alt='profile photo'
          className='w-20 h-20 rounded-full object-cover'
        />
        <button
          type='button'
          className='w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
          onClick={handleRemoveImage}
        >
        <LuTrash />
        </button>
      </div>
    ):(
      <div className="w-20 h-20 flex items-center justify-center bg-cyan-100 rounded-full relative">
        <LuUser className='text-4xl '/>

        <button
          type='button'
          className='w-8 h-8 flex items-center justify-center bg-cyan-500 text-white rounded-full absolute -bottom-1 -right-1'
          onClick={onChooseFile}
        >
          <LuUpload />  
        </button>

      </div>
    )}
    </div>
  )
}

export default ProfilePhotoSelector