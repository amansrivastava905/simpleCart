import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import camera from '../assets/camera.png'
import firebase from '../firebase'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { AiOutlineEdit } from 'react-icons/ai'
import { useHistory } from 'react-router'
import Loader from 'react-loader-spinner'

const Product = ({ data }) => {


    const [image, setImage] = useState(camera)
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    const deleteHandler = () => {
        setLoading(true)
        firebase.firestore().collection(`products`).where("productName", "==", data.productName).where("productPrice", "==", data.productPrice).where("productDescription", "==", data.productDescription).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete().then(() => {
                        setLoading(false)
                        history.go(0)
                    });
                })
            });
    }

    const editHandler = () => {
        history.push({
            pathname: '/addProduct',
            state: {
                productName: data.productName,
                productPrice: data.productPrice,
                productDescription: data.productDescription,
                productImage: data.imageFile,
                productId: data.productId,
                edit: true
            }
        })
    }



    useEffect(() => {
        let mounted = true
        if (mounted) {
            var storage = firebase.storage();
            var storageRef = storage.ref();
            var spaceRef = storageRef.child(`images/${data.imageFile}`);
            spaceRef.getDownloadURL().then(function (url) {
                setImage(url)
                setLoading(false)
            }).catch(function (error) {
                // some error handler
            });

        }
        return function cleanup() {
            mounted = false
        }
    }, [data.imageFile])



    return (
        <MainContainer>
            <Wrapper>
                <ImageContainer>
                    <Image src={image} />
                </ImageContainer>
                <ProductDetails>
                    <Name>{data.productName}</Name>
                    <Price>${data.productPrice}</Price>
                    <Description>{data.productDescription}</Description>
                </ProductDetails>
            </Wrapper>
            <ButtonsContainer>
                {
                    loading ? <Loader
                        type="TailSpin"
                        color="#3a2dce"
                        height={18}
                        width={18}
                    /> :
                        <DeleteButton onClick={deleteHandler} />
                }
                <EditButton onClick={editHandler} />
            </ButtonsContainer>
        </MainContainer>
    )
}

export default Product


const MainContainer = styled.div`
        width:400px;
        background-color:white;
        padding:10px;
        margin:5px 5px;
        border-radius:10px;
        transition:0.3s box-shadow;
        box-shadow: 2px 0px 16px -9px rgba(0,0,0,0.75);
        &:hover{
            box-shadow:none;
            transition:0.3s box-shadow;
        }
    @media screen and (max-width:500px){
        width:100%;
        background-color:white;
        padding:10px;
        margin:5px 0px;
        border-radius:10px;
        transition:0.3s box-shadow;
        box-shadow: 2px 0px 16px -9px rgba(0,0,0,0.75);
        &:hover{
            box-shadow:none;
            transition:0.3s box-shadow;
        }
    }
`
const Wrapper = styled.div`
    padding:0px 10px 10px 10px;
    display:flex;
`

const ButtonsContainer = styled.div`
    display:flex;
    justify-content:space-between;
    padding:10px 10px 5px 10px;
`

const ImageContainer = styled.div`
    display:flex;
    justify-content:center;
    padding-right:20px;
`

const Image = styled.img`
    width:100px;
`
const DeleteButton = styled(RiDeleteBin5Line)`
    color:red;
    font-size:18px;
    cursor:pointer;
`
const EditButton = styled(AiOutlineEdit)`
    color:green;
    font-size:18px;
    cursor:pointer;
    text-decoration:none;
`

const ProductDetails = styled.div``

const Name = styled.h3`
    font-weight:normal;
    color:rgba(0,0,0,0.9);
    padding-bottom:5px;
`

const Price = styled.h4`
    color:green;
    padding-bottom:5px;
`

const Description = styled.p`
    font-size:14px;
    font-weight:lighter;
`
