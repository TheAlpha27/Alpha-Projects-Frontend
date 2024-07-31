export const getUniqueObjectsForKey = (array, key) => {
  const uniqueObject = {};
  array.forEach((obj) => {
    const keyValue = obj[key];
    if (!uniqueObject[keyValue]) {
      uniqueObject[keyValue] = obj;
    }
  });
  const uniqueArray = Object.values(uniqueObject);
  return uniqueArray;
};

export const getClientOptions = (data) => {
  const options = [{ value: "", label: "Select Client" }];
  data.forEach((e) => {
    if (e.client) options.push({ value: e.client, label: e.client });
  });
  return getUniqueObjectsForKey(options, "value");
};

export const getProjectManagerOptions = (data) => {
  const options = [{ value: "", label: "Select Project Manager" }];
  data.forEach((e) => {
    if (e.project_manager)
      options.push({
        value: e.project_manager,
        label: e.project_manager,
      });
  });
  return getUniqueObjectsForKey(options, "value");
};

export const getLocationOptions = (data) => {
  const options = [{ value: "", label: "Select Location" }];
  data.forEach((e) => {
    if (e.city) options.push({ value: e.city, label: e.city });
  });
  return getUniqueObjectsForKey(options, "value");
};

export const getCategoryOptions = (data) => {
  const options = [{ value: "", label: "Select Category" }];
  data.forEach((e) => {
    if (e.project_category)
      options.push({ value: e.project_category, label: e.project_category });
  });
  return getUniqueObjectsForKey(options, "value");
};

export const getAmountOptions = (data) => {
  const options = [{ value: "", label: "Select Amount" }];
  data.forEach((e) => {
    if (e.contract_amount)
      options.push({ value: e.contract_amount, label: e.contract_amount });
  });
  return getUniqueObjectsForKey(options, "value");
};

export const generateRandomKey = () =>
  `${Date.now()}${Math.floor(Math.random() * 100)}`;

export const setPopUpObjFunc = (popUpObjArr, setPopUpObjArr, popUpObj) => {
  const tempPopUpObjArr = popUpObjArr ? [...popUpObjArr] : [];
  tempPopUpObjArr.push({ ...popUpObj, key: generateRandomKey() });
  setPopUpObjArr(tempPopUpObjArr);
};
