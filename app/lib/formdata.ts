export const consoleLogFormData = (name: string, formData: FormData) => {
    const formDataObj = Object.fromEntries(formData.entries());
    // console.log(name, JSON.stringify(formDataObj, null, 2));
};
export const consoleLogFormDatas = (name: string, formDatas: FormData[]) => {
    formDatas.forEach(s => {
        consoleLogFormData(name, s);
    });

};
