
import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue, img, setImg, adress, setAdress }) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Enter new img"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Enter new adress"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default CategoryForm;