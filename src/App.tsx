import React, { useState, useEffect } from 'react';
import Table from 'components/Table';
import ParceiroModal from 'components/ParceiroModal';
import Pagination from 'components/Pagination';
import TeddyApi from 'utils/TeddyApi';
import { Parceiro } from 'components/ParceiroModal';
import { excluir } from 'utils/ParceirosService';
import './styles.scss';

interface ParceiroMicroProps {
  page: number,
  setPage: any;
}

const App: React.FC<ParceiroMicroProps> = ({ page, setPage }) => {

  const columns = [
    { Header: 'Nome', accessor: 'name' },
    { Header: 'Descrição', accessor: 'description' },
    { Header: 'Repositório do Git', accessor: 'repositoryGit' },
    { Header: 'Clientes', accessor: 'clients' },
    { Header: 'Projetos', accessor: 'projects'},
  ];

  const [data, setData] = useState<Parceiro[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEditData, setModalEditData] = useState<Parceiro | null>(null);

  const [currentPage, setCurrentPage] = useState(page);
  const totalPages = Math.ceil(data.length / 5);

  const loadAll = async () => {
    try {
      await TeddyApi.get(`/`).then((res) => {
        console.log(res.data)
        setData(res.data);
        return true;
      });
    } catch (err) {

    }
  };

  const onDelete = (id: any) => {
    excluir(id);
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
  }

  const onEdit = (parceiro: any) => {
    setModalEditData(parceiro);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const updatePage = (p: number) => {
    setCurrentPage(p);
    setPage(p);
  }

  const refreshTable = () => {
    setTimeout(() => {
      loadAll();
    }, 500)
  }

  useEffect(() => {
    if (!isModalOpen) {
      setModalEditData(null);
    }
  }, [isModalOpen]);

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="partner-page">
      <button className="create-button" onClick={() => setIsModalOpen(true)}>
        Cadastrar parceiro
      </button>

      <div className="table-container">
        <Table columns={columns}
          data={data.slice((currentPage - 1) * 5, currentPage * 5)}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={page => updatePage(page)}
      />

      <ParceiroModal isOpen={isModalOpen} onRequestClose={handleCloseModal} refresh={refreshTable} edit={modalEditData}/>
    </div>
  );
};

export default App;