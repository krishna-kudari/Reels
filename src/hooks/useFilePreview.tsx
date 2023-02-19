import { useState , useEffect } from "react";

export default function useFilePReview(file:File){
    const [imgSrc, setImgSrc] = useState<string|null>(null);

    useEffect(()=>{
        if(file){
            const newUrl = URL.createObjectURL(file);

            if(newUrl !== imgSrc){
                setImgSrc(newUrl);
            }
        }
    },[file]);

    return [imgSrc , setImgSrc];
}