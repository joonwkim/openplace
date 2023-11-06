export const consoleLogFormData = (name: string, formData: FormData,) => {
    const formDataObj = Object.fromEntries(formData.entries());
    console.log(name, JSON.stringify(formDataObj, null, 2));
};