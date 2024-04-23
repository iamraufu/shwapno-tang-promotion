import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import logo from '../images/logo.svg'
import useAuth from '../hooks/useAuth';

const Home = () => {

      const { user, logOut } = useAuth()
      const { register, handleSubmit, formState: { errors } } = useForm();
      const onSubmit = data => processSMS(data);
      const [message, setMessage] = useState("")
      const [phone, setPhone] = useState()
      const [invoiceDisplay, setInvoiceDisplay] = useState(false)
      const [invoiceDetails, setInvoiceDetails] = useState({})

      const processSMS = (formData) => {

            setPhone(formData.phone)

            const btn = document.getElementById('btn_sms')
            btn.innerText = 'Sending SMS. Please wait...'
            btn.disabled = true

            const nameInputValue = document.getElementById('input_name')
            const phoneInputValue = document.getElementById('input_phone')

            const fetchData = async () => {

                  const data = {
                        name: formData.name.trim(),
                        phone: formData.phone,
                        code: user.code.trim(),
                        description: user.name.trim()
                  }

                  try {

                        const requestOptions = {
                              method: "POST",
                              headers: {
                                    "Content-Type": "application/json"
                              },
                              body: JSON.stringify(data)
                        }

                        const response = await fetch(`https://shwapnooperation.onrender.com/api/send-sms`, requestOptions)
                        const result = await response.json()
                        
                        if (result.status) {
                              setInvoiceDetails(result.data)

                              result?.data?.invoice?.length > 0 ? setMessage(`Invoice: ${result.data.invoice}`) : setMessage(result.message)

                              nameInputValue.disabled = true
                              phoneInputValue.disabled = true

                              // btn.innerText = 'Complete'
                              // btn.disabled = false

                              btn.style.display = 'none'
                              // completeBtn.style.display = 'block'

                              setInvoiceDisplay(true)
                        }
                        else {
                              setMessage(result.message)
                              btn.innerText = 'Send SMS'
                              btn.disabled = false
                        }
                  } catch (error) {
                        console.log(error);
                  }
            };
            fetchData();
      }

      const updateInvoice = async () => {
            const invoice = document.getElementById('input_invoice').value

            const fetchData = async () => {

                  const btn = document.getElementById('btn_complete')
                  btn.innerText = 'Saving. Please wait...'
                  btn.disabled = true

                  const requestData = {
                        invoice,
                        phone
                  }

                  const requestOptions = {
                        method: "PATCH",
                        headers: {
                              "Content-Type": "application/json"
                        },
                        body: JSON.stringify(requestData)
                  }

                  const response = await fetch(`https://shwapnooperation.onrender.com/api/send-sms`, requestOptions)
                  const result = await response.json()

                  result.status && window.location.reload()
            }

            invoice.length === 7 && fetchData()
      }

      return (
            <div className="bg-image">
                  <div className="flex items-center gap-5 p-5 bg-violet-800 text-white">
                        <div className="flex gap-5">
                              <img src={logo} className='' alt="Shwapno Brand Logo" />
                              <h1 className='text-lg font-medium my-3 '>Shwapno Tang Promotion</h1>
                        </div>

                        <div className="ms-auto">
                              <h2 className='capitalize'>{user.code} ({user.name})</h2>
                        </div>

                        <button onClick={() => logOut()} className='bg-[#d9c1ff] hover:bg-[#d9c1ff] py-2 rounded-md text-xs px-3 text-rose-800 font-bold'>Logout</button>
                  </div>


                  <div className="w-full flex justify-around items-center">
                        <div className="ml-20 flex items-center h-[75vh] flex-1">
                              <div className='w-1/3 p-3 text-center'>

                                    <div className="">
                                          <h2 className='text-left text-xl font-medium'>Customer Details</h2>
                                          <form onSubmit={handleSubmit(onSubmit)}>

                                                <div className="my-2">
                                                      <input id='input_name' placeholder='Enter Customer Name' autoComplete={`name`} className='w-full p-2 border-2 border-violet-600 focus:outline-violet-800 rounded bg-white' type='text' {...register("name", { required: true })} />
                                                      <br />
                                                      {errors.name && <span className='text-rose-500'>*Name required</span>}
                                                </div>

                                                <div className="my-2">
                                                      <input id='input_phone' placeholder='Enter Customer Phone Number' autoComplete={`phone-number`} className='w-full p-2 border-2 border-violet-600 focus:outline-violet-800 rounded' type='number' {...register("phone", { required: true, pattern: /^01[3-9]\d{8}$/, maxLength: 11 })} />
                                                      <br />
                                                      {errors.phone && <span className='text-rose-500'>*Invalid Phone Number</span>}
                                                </div>

                                                {
                                                      invoiceDisplay && !invoiceDetails?.invoice?.length > 0 &&
                                                      <div className="my-2">
                                                            <input id='input_invoice' placeholder='Enter Invoice Number' className='w-full p-2 border-2 border-violet-600 focus:outline-violet-800 rounded bg-white' type='text'
                                                                  {...register("invoice", { required: true, minLength: 7, maxLength: 7 })} />
                                                            <br />
                                                            {errors.invoice && <span className='text-rose-500'>*Invalid Invoice</span>}
                                                      </div>
                                                }

                                                <button id='btn_sms' type="submit" className='bg-violet-700 hover:bg-violet-800 text-white w-[100%] py-2 rounded-md'>Send SMS</button>
                                          </form>

                                          {
                                                invoiceDisplay && !invoiceDetails?.invoice?.length > 0 &&
                                                <button onClick={() => updateInvoice()} id='btn_complete' type="submit" className='bg-violet-700 hover:bg-violet-800 text-white w-[100%] py-2 rounded-md'>Complete</button>
                                          }
                                          <p className='my-2 text-left'>{message}</p>
                                    </div>

                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default Home;