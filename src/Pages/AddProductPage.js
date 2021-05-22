import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import camera from '../assets/camera.png'
import firebase from '../firebase'
import Loader from 'react-loader-spinner'
import { useLocation } from "react-router-dom";

const AddProductPage = () => {

    const [image, setImage] = useState(camera)
    const [imageFile, setImageFile] = useState(null)
    const [productName, setProductName] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [productId, setProductId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [edit, setEdit] = useState(false)

    const location = useLocation();


    const addImageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImage(reader.result)
                setImageFile(e.target.files[0])
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    const handleName = (e) => {
        setProductName(e.target.value)
    }

    const handleDescription = (e) => {
        setProductDescription(e.target.value)
    }

    const handlePrice = (e) => {
        setProductPrice(e.target.value)
    }



    const handleSave = (e) => {
        if (productName === "" || productPrice === "" || productDescription === "" || imageFile === null) {
            alert("some fields are left empty")
        } else {
            setLoading(true)
            const file = imageFile
            if (productId !== null) {
                console.log(productId)
                if (file) {
                    firebase.storage().ref(`images/${file.name}`).put(file).then(() => {

                        firebase.firestore().collection("products").doc(productId).update({
                            productName,
                            productDescription,
                            productPrice,
                            imageFile: file.name
                        }).then(() => {
                            setImageFile(null)
                            setImage(camera)
                            setProductDescription("")
                            setProductName("")
                            setProductPrice("")
                            setProductId("")
                            setLoading(false)
                            e.preventDefault();
                            window.location.href = '/';
                        })
                    })
                } else {
                    firebase.firestore().collection("products").doc(productId).update({
                        productName,
                        productDescription,
                        productPrice
                    }).then(() => {
                        setImageFile(null)
                        setImage(camera)
                        setProductDescription("")
                        setProductName("")
                        setProductPrice("")
                        setProductId("")
                        setLoading(false)
                        e.preventDefault();
                        window.location.href = '/';
                    })
                }
            } else {
                firebase.storage().ref(`images/${file.name}`).put(file).then(() => {
                    firebase.firestore().collection("products").add({
                        productName,
                        productDescription,
                        productPrice,
                        imageFile: file.name
                    })
                        .then((docRef) => {
                            firebase.firestore().collection("products").doc(docRef.id).update({
                                productId: docRef.id,
                                productName,
                                productDescription,
                                productPrice,
                                imageFile: file.name
                            })
                            setImageFile(null)
                            setImage(camera)
                            setProductDescription("")
                            setProductName("")
                            setProductPrice("")
                            setLoading(false)
                            e.preventDefault();
                            window.location.href = '/';
                        })
                        .catch((error) => {
                            setLoading(false)
                            console.log(error)
                        });
                })
            }
        }

    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            if (location.state) {
                setProductName(location.state.productName)
                setProductDescription(location.state.productDescription)
                setProductPrice(location.state.productPrice)
                setProductId(location.state.productId)
                var storage = firebase.storage();
                var storageRef = storage.ref();
                var spaceRef = storageRef.child(`images/${location.state.productImage}`);
                spaceRef.getDownloadURL().then(function (url) {
                    setImage(url)
                }).catch(function (error) {
                    // some error handler
                });
            }
        }

        return function cleanup() {
            mounted = false
        }
    }, [location, edit, imageFile]);


    return (
        <MainContainer>
            <Heading>Add Product</Heading>
            <FormContainer>
                <UploadImageContainer>
                    <Label>Upload Photo</Label>
                    <FileInput src={image} />
                    <UploadImage type="file" accept="image/*" id="upload" onChange={addImageHandler} />
                    <ImageAdd htmlFor="upload">Add image</ImageAdd>
                </UploadImageContainer>
                <InputsContainer>
                    <InputBox>
                        <LabelContainer>
                            <Label>Product Name*</Label>
                        </LabelContainer>
                        <Input type="text" onChange={handleName} value={productName} />
                    </InputBox>
                    <InputBox>
                        <LabelContainer>
                            <Label>Description*</Label>
                        </LabelContainer>
                        <Input type="text" onChange={handleDescription} value={productDescription} />
                    </InputBox>
                    <InputBox>
                        <LabelContainer>
                            <Label>Price*</Label>
                        </LabelContainer>
                        <Input type="text" onChange={handlePrice} value={productPrice} />
                    </InputBox>
                    <ButtonContainer>
                        {
                            loading ? <Loader
                                type="TailSpin"
                                color="#3a2dce"
                                height={50}
                                width={50}
                            /> : <Button onClick={handleSave}>Save</Button>
                        }
                    </ButtonContainer>
                </InputsContainer>
            </FormContainer>
        </MainContainer>

    )
}

export default AddProductPage



const MainContainer = styled.div`
    padding:50px 100px;
    @media screen and (max-width:500px){
        padding:20px 20px;
    }
`

const Heading = styled.h1`
    font-weight:normal;
    color:rgba(0,0,0,0.9);
`

const FormContainer = styled.div`
    display:flex;
    justify-content:space-around;
    flex-wrap:wrap;
    @media screen and (max-width:500px){
       justify-content:space-between;
    }
`

const UploadImageContainer = styled.div`
    padding: 50px 0px 20px 0px;
    display:flex;
    flex-direction:column;
`

const Label = styled.p`
    color:rgba(0,0,0,0.7);
    padding-bottom:5px;
    font-size:14px;
`

const FileInput = styled.img`
        width:200px;
        border:1px solid #cdcdcd;
        margin:0px 0px 10px 0px;
        border-radius:5px;
        overflow:hidden;
        box-shadow: 2px 0px 16px -9px rgba(0,0,0,0.75);
    
    @media screen and (max-width:500px){
        width:100px;
        border:1px solid #cdcdcd;
        margin:0px 0px 10px 0px;
        border-radius:5px;
        overflow:hidden;
        box-shadow: 2px 0px 16px -9px rgba(0,0,0,0.75);
    }
`

const InputsContainer = styled.div`
    @media screen and (max-width:500px){
        width:100%;
    }
`

const InputBox = styled.div`
    padding:10px 0px;
    @media screen and (max-width:500px){
        display:flex;
        justify-content:center;
        flex-direction:column;
        align-items:center;
    }
`

const Input = styled.input`
        width:500px;
        padding:5px;
        font-size:18px;
        color:rgba(0,0,0,0.8);
        border:3px solid rgba(0,0,0,0);
        transition:0.3s border;
        outline:none;
        border-radius:7px;
        &:hover{
            border:3px solid green;
            transition:0.3s border;
        }
    @media screen and (max-width:500px){
        width:100%;
        padding:5px;
        font-size:18px;
        color:rgba(0,0,0,0.8);
        border:3px solid rgba(0,0,0,0);
        transition:0.3s border;
        outline:none;
        border-radius:7px;
        &:hover{
            border:3px solid green;
            transition:0.3s border;
        }
    }
`
const LabelContainer = styled.div`
  @media screen and (max-width:500px){
        width:100%;
    }
`

const ButtonContainer = styled.div`
    padding-top:50px;
    @media screen and (max-width:500px){
        padding-top:50px;
        display:flex;
        justify-content:center;
    }
`

const Button = styled.button`
        width:500px;
        padding:10px;
        border:3px solid rgba(0,0,0,0);
        transition:0.3s border;
        box-shadow: 2px 0px 16px -9px rgba(0,0,0,0.75);
        outline:none;
        background-color:green;
        border-radius:7px;
        font-size:18px;
        color:white;
        &:hover{
            border:3px solid darkgreen;
            transition:0.3s border;
        }
    @media screen and (max-width:500px){
        width:100%;
        padding:10px;
        border:3px solid rgba(0,0,0,0);
        transition:0.3s border;
        box-shadow: 2px 0px 16px -9px rgba(0,0,0,0.75);
        outline:none;
        background-color:green;
        border-radius:7px;
        font-size:18px;
        color:white;
        &:hover{
            border:3px solid darkgreen;
            transition:0.3s border;
        }
    }
`

const UploadImage = styled.input`
    display:none;
`
const ImageAdd = styled.label`
    background:green;
    color:white;
    padding:5px;
    border-radius:5px;
    width:200px;
    text-align:center;
    border:3px solid rgba(0,0,0,0);
    box-shadow: 2px 0px 16px -9px rgba(0,0,0,0.75);
    @media screen and (max-width:500px){
        width:100px;
    }
    &:hover{
            border:3px solid darkgreen;
            transition:0.3s border;
        }

`
