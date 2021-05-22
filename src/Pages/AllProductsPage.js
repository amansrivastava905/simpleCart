import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import firebase from '../firebase'
import Loader from 'react-loader-spinner'
import Product from '../components/Product'
import { Link } from 'react-router-dom'

const AllProductsPage = () => {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)




    useEffect(() => {
        let mounted = true
        firebase.firestore().collection(`products`).get().then((querySnapshot) => {
            if (mounted) {
                const data = querySnapshot;
                setProducts(data.docs);
                setLoading(false);
            }
        });

        return function cleanup() {
            mounted = false
        }
    }, [])

    return (
        <MainContainer>
            <Heading>Products</Heading>
            <Wrapper>
                <ProductsContainer>
                    {
                        loading ?
                            <LoaderContainer>
                                <Loader
                                    type="TailSpin"
                                    color="green"
                                    height={100}
                                    width={100}
                                />
                            </LoaderContainer> :
                            products.length === 0 ? <Empty>No product added</Empty> : products.map((product) => {
                                return (
                                    <Product
                                        key={product.id}
                                        data={product.data()}
                                    />
                                );
                            })
                    }
                </ProductsContainer>
                <ButtonContainer>
                    <Button to="/addProduct">Add Product</Button>
                </ButtonContainer>
            </Wrapper>
        </MainContainer>
    )
}

export default AllProductsPage



const MainContainer = styled.div`
    padding:50px 100px;
    @media screen and (max-width:500px){
        padding:20px 20px;
    }
`


const Heading = styled.h1`
    font-weight:bold;
    font-size:42px;
    padding-top:20px;
    color:rgba(0,0,0,0.9);
    padding-bottom:50px;
`

const Wrapper = styled.div`
    display:flex;
    flex-direction:column-reverse;
    justify-content:space-between;
`

const ProductsContainer = styled.div`
    display:flex;
    flex-wrap:wrap;
    padding-bottom: 100px;
`

const LoaderContainer = styled.div`
    width:100%;
    height:50vh;
    display:flex;
    justify-content:center;
    align-items:center;
`

const ButtonContainer = styled.div`
    padding-top:20px;
    padding-bottom:50px;
    @media screen and (max-width:500px){
        display:flex;
        padding-top:50px;
        width:100%;
        justify-content:center;
        position:fixed;
        top:80vh;
        left:0;
    }
`


const Button = styled(Link)`

        width:300px;
        padding:10px;
        border:3px solid rgba(0,0,0,0);
        transition:0.3s border;
        box-shadow: 2px 0px 16px -9px rgba(0,0,0,0.75);
        outline:none;
        background-color:green;
        border-radius:7px;
        font-size:18px;
        color:white;
        text-decoration:none;
        text-align:center;
        &:hover{
            border:3px solid darkgreen;
            transition:0.3s border;
        }
    @media screen and (max-width:500px){
        padding:10px;
        border:3px solid rgba(0,0,0,0);
        transition:0.3s border;
        box-shadow: 2px 0px 16px -9px rgba(0,0,0,0.75);
        outline:none;
        background-color:green;
        border-radius:7px;
        font-size:18px;
        color:white;
        width:80%;
        &:hover{
            border:3px solid darkgreen;
            transition:0.3s border;
        }
    }
`


const Empty = styled.h1`
  color:rgba(0,0,0,0.7);
  font-weight:lighter;
  font-size:24px;
  padding:50px 0px 0px 0px;
`
