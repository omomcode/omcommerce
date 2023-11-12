
export default {
  beforeFindOne(event) {
    const { data, where, select, populate } = event.params;

    console.log("Am i doing the lifecycle??");
    console.log(event.params.data.name);
  },

};
