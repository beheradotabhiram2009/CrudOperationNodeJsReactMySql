//to displa the image
export const  blobToBase64 = (value) =>{
    const byteNumbers = value?.data;
    let byteChars = '';
    for (let i = 0; i < byteNumbers?.length; i++) {
        byteChars += String.fromCharCode(byteNumbers[i]);
    }
    //alert(byteChars);
    return byteChars;
}; 

//to set the date
export const toDateStr=(dt)=>{
    const m = dt.getMonth()+1;
    return (dt.getFullYear() + '-' + m + '-' + dt.getDate());
}
