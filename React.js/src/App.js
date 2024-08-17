
import './App.css';
import axios from './axios.js';


import { useState, useEffect } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCubes, faFilePen, faTrashCan} from '@fortawesome/free-solid-svg-icons';

import "./form.css";
import "./product.css";


const App = () => {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');  
  const [errorMessage, setErrorMessage] = useState('');
  
  const [articleCount, setArticleCount] = useState([]);
  const [article, setArticle] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    name: '',
  });
  const [isSearching, setIsSearching] = useState(false);   



  //  Show Product
  const fetchProduct = async () => {

    try {
  
      const params = new URLSearchParams();
      params.set('name', searchQuery.name);

      const response = await axios.get('articles', { params });
      // console.log(response);
      setArticleCount(response.data.articleCount);
      setArticle(response.data.article);

    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    if (isSearching || (searchQuery.name === '')) {
      setIsSearching(false);
      fetchProduct()
    }
  }, [isSearching, searchQuery]);
  
  
  const handleClearSearch = (e) => {
    setSearchQuery({ name: ''});
    setIsSearching(true);

    setSearchQuery({
      ...searchQuery,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };
  


  // Edit Product

  const [selectedProduct, setSelectedProduct] = useState(null);
  
  useEffect(() => {
  }, [selectedProduct]);
  
  const productEdit = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    // console.log("Product Id:", selectedProduct);
  };
  
  const productEditClose = () => {
    setSelectedProduct(null);
  };

  const editProduct = async (e, id) => {
    e.preventDefault();

    // console.log("Edit iD",id);

  
    const formData = new FormData();
  
    // Value with IDs
    const nameInput = document.getElementById('name');
    const priceInput = document.getElementById('price');
    const descriptionInput = document.getElementById('description');
    const stockInput = document.getElementById('stock');
  
    if (nameInput && priceInput && descriptionInput && stockInput) {
      formData.append('id', id);
      formData.append('name', nameInput.value);
      formData.append('price', priceInput.value);
      formData.append('description', descriptionInput.value);
      formData.append('stock', stockInput.value);
  
      // Show the content of FormData
     /*for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      */ 
        const response = await axios.put(`renew`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

       // console.log(response.data);
    
        if (response.status === 200) {
          fetchProduct();
          productEditClose();
        }

    } else {
      console.error('Elements not exist');
    }
  };



  // Delete Product
  const [deleteProduct, setDeleteProduct] = useState(null);
  
  useEffect(() => {
    if (deleteProduct) {
      // talentSearch(deleteProduct.id);
    }
  }, [deleteProduct]);
  
  const deleteProductModal = (deleteProduct) => {
    setDeleteProduct(deleteProduct);
    console.log("Product Id:", deleteProduct);
  };
  
  const deleteProductClose = () => {
    setDeleteProduct(null);
    setErrorMessage(null);
  };
  

  const productDelete = async (e, id) => {
    e.preventDefault();
  
      const response = await axios.delete(`delete`, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: id
        }
      });

      console.log(response.data);
  
      if (response.status === 200) {
        deleteProductClose();
        fetchProduct();
      } 

  };

      

  // New Product 
  const [insert, setInsert] = useState(false);

  const inserForm = () => {
    setInsert(!insert);
    setName(null);
    setPrice(null);
    setDescription(null);
    setStock(null);
    setErrorMessage(null);
  };

  const inserFormClose = () => {
    setInsert(null);
    setName(null);
    setPrice(null);
    setDescription(null);
    setStock(null);
    setErrorMessage(null);
  };

  const productCreate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('stock', stock);

    const response = await axios.post(`articles`, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response);
    
    if (response.status === 200) {
      inserFormClose();
      fetchProduct();
    }

  };



  return (
    <div>

    <div className='table-div'>
    <h1>CRUD Search Pagination</h1>
    <h3>Python 3.10 Flask (Route/Api) and React.js 18</h3>

    <div className='add'>
    <span className='newProduct' onClick={inserForm}>New Product</span>
    </div>


    <div className="div-search">
            <input
              required
              type="text"
              className="search"
              placeholder="Search"
              name="name"
              value={searchQuery.name}
              onChange={handleClearSearch}
            />

          <span>  <FontAwesomeIcon className="faCubes" icon={faCubes} /> </span>
          <div>{articleCount}</div>
          </div>

    <table className='table'>
      <thead>
        <tr>
        <th>#</th>
          <th>PRODUCT</th>
          <th>PRICE</th>
          <th>STOCK</th>
          <th>DETAILS</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>


        {article && article.length > 0 ? (
          article.map((art) => (
        <tr key={art.id}>
          <td> {art.id} </td>
          <td> {art.name} </td>
          <td> {art.price} </td>
          <td> {art.stock} </td>
          <td> {art.description} </td>
          <td>

          <FontAwesomeIcon 
           icon={faFilePen}
           onClick={() => productEdit(art)}
           className='faFilePen'
            />

          <FontAwesomeIcon 
           icon={faTrashCan}
           onClick={() => deleteProductModal(art)}
           className='faTrashCan'
            /> 

            </td>
        </tr>
          ))
        ) : (

          <tr>
            <td className='empty' colSpan="6">Empty</td>
          </tr>

        )}


      </tbody>
    </table>
    </div>



  {/* Form Edit Product */}
  {selectedProduct && (
<div className="formularios-Project">
  <div className="form">
    <div className="row">
      <div>
        <form className="form-horztal">
          <div className="form-title">Edit Product</div> 
          <div className="form-error">{errorMessage}</div>
          <div>
            <div className="subtitle">Name</div>
            <input
              defaultValue={selectedProduct.name}
              onChange={(e) => setName(e.target.value)}
              required
              id='name'
              type="text"
              className="form-control"
              placeholder="Name"
            />
          </div>

          <div className="">
            <div className="subtitle">Price</div>
            <input
              defaultValue={selectedProduct.price}
              onChange={(e) => setPrice(e.target.value)}
              required
              type="number"
              className="form-control"
              id="price"
              autoComplete="name"
              placeholder='Stock'
            />
          </div>

          <div>
            <div className="subtitle">Description</div>
            <div className="divArea">
              <textarea
                defaultValue={selectedProduct.description}
                onChange={(e) => setDescription(e.target.value)}
                required
                type="text"
                id="description"
                placeholder='Description'
                style={{
                  fontSize: '18px',
                  width: '250px',
                  maxWidth: '260px',
                  height: '80px',
                  maxHeight: '95px',
                }}
              ></textarea>
            </div>
          </div>

          <div className="">
            <div className="subtitle">Stock</div>
            <input
              defaultValue={selectedProduct.stock}
              onChange={(e) => setStock(e.target.value)}
              required
              type="number"
              className="form-control"
              id="stock"
              autoComplete="name"
              placeholder='Stock'
            />
          </div>

          <div className="form-btns-project">
            <div className="form-btn">
              <button
                type="submit"
                className="btn-close"
                onClick={productEditClose}
              >
                Close
              </button>
            </div>
            <div className="form-btn">
              <button
                type="submit"
                className="btn-default"
                onClick={(e) =>
                  editProduct(
                    e,
                    selectedProduct.id
                  )
                }
              >
                Edit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
)}



  {/* Form Delete Product */}
  {deleteProduct && (
  <div className="form-delete">
    <div className="row">
      <div>
        <form className="form-horztal">
          <div className="form-title">Delete Product</div> 
            <div className="subtitleDelete"> {deleteProduct.name} </div>

          <div className="form-btns-project">
            <div className="form-btn">
              <button
                type="submit"
                className="btn-close"
                onClick={deleteProductClose}
              >
                Close
              </button>
            </div>
            <div className="form-btn">
              <button
                type="submit"
                className="btn-default"
                onClick={(e) =>
                  productDelete(
                    e,
                    deleteProduct.id
                  )
                }
              >
                Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
)}



  {/* New Product */}
  {insert && (
      <div className="formularios-Project">
  <div className="form">
    <div className="row">
      <div>
        <form className="form-horztal">
          <div className="form-title">New Product</div> 
          <div className="form-error">{errorMessage}</div>           
          <div>
          <div className="subtitle">Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
              className="form-control"
              placeholder="Name"
              id="exampleInputEmail1"
            />
          </div> 

          <div>
          <div className="subtitle">Price</div>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              type="number"
              className="form-control"
              placeholder="Price"
              id="exampleInputEmail1"
              autoComplete="name"
            />
          </div> 

          <div>
          <div className="subtitle">Description</div>
          <div className="divArea">
          <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder='Description'
          type="text"
          id="exampleInputEmail1"
          style={{ fontSize: '18px', width: '250px', maxWidth: '260px', height: '80px', maxHeight: '95px' }}
        ></textarea>
        </div>
        </div>

          <div className="">
          <div className="subtitle">Stock</div>
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              type="number"
              className="form-control"
              id="exampleInputEmail1"
              placeholder='Stock'
            />
          </div>

          {/* This Logo
          <div>
          <div className="subtitle">Logo</div>
            <input
              value={logotipo}
              onChange={(e) => setDescription(e.target.value)}
              required
              type="file"
              className="form-file"
              placeholder="Name"
              id="exampleInputEmail1"
              autoComplete="name"
            />
          </div>
           */}

          <div className='form-btns-project'>
            <div className="form-btn">
              <button
                type="submit"
                className="btn-close"
                onClick={inserFormClose}
                >
                  Close
              </button>
            </div>
            <div className="form-btn">
            <button type="submit" className="btn-default"
              onClick={productCreate}
              >
                Create
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
)}

    </div>
  );
};



export default App;
