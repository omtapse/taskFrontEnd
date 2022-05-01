import Table from "../components/Table/table";
import styles from "../styles/Home.module.css";
import { RecoilRoot, atom } from "recoil";
import Form from "../components/Form";
import { useEffect } from "react";

export default function Home() {
  const modalState = atom({
    key: "modalState",
    default: false,
  });

  const users = atom({
    key: "users",
    default: [],
  });

  useEffect(() => {
    console.log("aa");
  }, []);

  const detailsToeditUser = atom({
    key: "detailsToeditUser",
    default: {},
  });

  const editState = atom({
    key: "editState",
    default: false,
  });

  const loadingState = atom({
    key: "LoadingState",
    default: false,
  });

  return (
    <RecoilRoot>
      <div className={styles.parant}>
      <h1 style={{textAlign:'center'}}>Table</h1>
      <div className={styles.container}>
        <Table
          modalState={modalState}
          loadingState={loadingState}
          editState={editState}
          detailsToeditUser={detailsToeditUser}
          users={users}
        />
        <Form
          modalState={modalState}
          loadingState={loadingState}
          editState={editState}
          users={users}
          detailsToeditUser={detailsToeditUser}
        />
      </div>
      </div>
    </RecoilRoot>
  );
}
