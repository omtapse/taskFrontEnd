import styles from "../../styles/Table.module.css";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { memo, useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Tables = (props) => {
  const columns = [
    { title: "First Name", dataIndex: "firstName" },
    { title: "Last Name", dataIndex: "lastName" },
    { title: "Email", dataIndex: "email" },
    { title: "Mobile No", dataIndex: "mobileNo" },
    { title: "" },
    { title: "" },
  ];

  const [open, setOpen] = useRecoilState(props.modalState);
  const [users, setUsers] = useRecoilState(props.users);
  const [editUser, setEditUser] = useRecoilState(props.detailsToeditUser);
  const [editState, setEditState] = useRecoilState(props.editState);
  const [loading, isLoading] = useRecoilState(props.loadingState);
  console.log(users);

  useEffect(() => {
    console.log("users");
    let cancelReq = false;
    if (!cancelReq) {
      axios
        .get("http://192.168.0.111:3000/users", {
          "Access-Control-Allow-Origin": "*",
        })
        .then((res) => {
          setUsers((oldUsers) => {
            return [...oldUsers, ...res.data];
          });
        });
      console.log(users);
    }
    return () => {
      cancelReq = true;
    };
  }, []);

  const edit = (id) => {
    const userTOEdit = users.filter((e) => {
      return e.id == id;
    });
    setEditUser(userTOEdit[0]);
    setEditState(true);
    setOpen(true);
  };

  const deleteUser = (id) => {
    isLoading(true)
    const userIndex = users.findIndex((x) => x.id == id);
    let allUsers = users.slice();
    allUsers.splice(userIndex, 1);
    setUsers(allUsers);
    axios
      .post(
        "http://192.168.0.111:3000/deleteUser",
        {
          id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        isLoading(false)
      });
  };

  return (
    <>
      <div
        className={styles.addButton}
        onClick={() => {
          setOpen(true);
          setEditState(false);
        }}
      >
        <PlusOutlined style={{ marginRight: "5px" }} /> Add User
      </div>
      <table className={styles.contentTable}>
        <thead>
          <tr>
            {columns.map((e, index) => {
              return <td key={e.dataIndex + index}>{e.title}</td>;
            })}
          </tr>
        </thead>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <tbody className="tableBody">
            {users.map((e) => {
              return (
                <tr>
                  <td>{e.firstName}</td>
                  <td>{e.lastName}</td>
                  <td>{e.email}</td>
                  <td>{e.mobileNo}</td>
                  <td style={{ width: "20px" }}>
                    <div className={styles.editButton}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => edit(e.id)}
                      >
                        <EditOutlined />{" "}
                        <p style={{ marginLeft: "5px" }}>edit</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ width: "20px" }}>
                    <div className={styles.deleteButton}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => deleteUser(e.id)}
                      >
                        <EditOutlined />{" "}
                        <p style={{ marginLeft: "5px" }}>delete</p>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
    </>
  );
};

export default memo(Tables);
