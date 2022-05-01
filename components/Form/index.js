import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import Styles from "../../styles/Table.module.css";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10%",
  p: 4,
};

const Form = (props) => {
  const [open, setOpen] = useRecoilState(props.modalState);
  const [users, setUsers] = useRecoilState(props.users);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [editUser, setEditUser] = useRecoilState(props.detailsToeditUser);
  const [editState, setEditState] = useRecoilState(props.editState);
  const [loading, isLoading] = useRecoilState(props.loadingState);

  useEffect(() => {
    setFName(editUser.firstName);
    setLName(editUser.lastName);
    setMobileNo(editUser.mobileNo);
    setEmail(editUser.email);
  }, [editUser]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFName("");
    setLName("");
    setMobileNo("");
    setEmail("");
  };
  const clearInput = () => {
    setFName("");
    setLName("");
    setMobileNo("");
    setEmail("");
  };

  const handleEditUser = () => {
    isLoading(true)
    const EditUser = {
      firstName: fName,
      lastName: lName,
      mobileNo: mobileNo,
      email: email,
      id: editUser.id,
    };

    const findIndex = users.findIndex((x) => x.id == EditUser.id);
    let allUsers = users.slice();
    allUsers[findIndex] = EditUser;
    setUsers(allUsers);
    axios
      .post(
        "http://192.168.0.111:3000/editUser",
        {
          EditUser,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.status);
        isLoading(false)
      })
      .catch((err) => {
        console.log(err);
      });

    handleClose();
  };

  const onSubmit = () => {
    isLoading(true)
    setEditState(false);
    const Newuser = {
      firstName: fName,
      lastName: lName,
      mobileNo: mobileNo,
      email: email,
      id: uuidv4(),
    };
    console.log();
    axios
      .post(
        "http://192.168.0.111:3000/adduser",
        {
          Newuser,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setUsers((oldUsers) => {
          return [...oldUsers, Newuser];
        });
        isLoading(false)
      })
      .catch((err) => {
        console.log(err);
      });

    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            style={{ marginBottom: "10px" }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Enter User Details
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div
              className="Form"
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "25px",
              }}
            >
              <TextField
                className={Styles.inputField}
                label="First Name"
                variant="standard"
                value={fName}
                onChange={(e) => setFName(e.target.value)}
              />
              <TextField
                className={Styles.inputField}
                label="Last Name"
                variant="standard"
                value={lName}
                onChange={(e) => setLName(e.target.value)}
              />
              <TextField
                className={Styles.inputField}
                type="number"
                label="Mobile No"
                variant="standard"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
              <TextField
                className={Styles.inputField}
                label="Email"
                variant="standard"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {editState ? (
              <Button onClick={handleEditUser} variant="contained">
                Edit
              </Button>
            ) : (
              <Button onClick={onSubmit} variant="contained">
                Submit
              </Button>
            )}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default Form;
