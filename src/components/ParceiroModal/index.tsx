import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { cadastrar, atualizar } from 'utils/ParceirosService'
import './styles.scss';

interface ParceiroModal {
  isOpen: boolean;
  onRequestClose: any;
  refresh: any;
  edit: any;
}

export interface Parceiro {
  id: any,
  name: string;
  description: string;
  repositoryGit: string;
  urlDoc: string;
  clients: Array<string>;
  projects: Array<string>;
}

const ParceiroModal: React.FC<ParceiroModal> = ({ isOpen, onRequestClose, refresh, edit }) => {

  const [projeto, setProjeto] = React.useState<string>('');
  const [cliente, setCliente] = React.useState<string>('');

  const [formData, setFormData] = React.useState<Parceiro>({
    id: '',
    name: '',
    description: '',
    repositoryGit: '',
    urlDoc: '',
    clients: [],
    projects: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (edit) {
      handleEdicao();
    } else {
      handleCadastro();
    }
  };

  const handleChange = (e: any) => {
    const { name, type, value, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClientesProjetos = (att: keyof Parceiro, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [att]: Array.isArray(prevData[att]) 
        ? [...prevData[att], value] // Se já for um array, adiciona o novo valor
        : [value] // Se não for um array, inicia um novo array com o valor
    }));
    setProjeto('');
    setCliente('');
  };

  const handleRemoverClientesProjetos = (att: keyof Parceiro, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [att]: Array.isArray(prevData[att])
        ? prevData[att].filter((item: string) => item.toString() !== value.toString()) // Compara os valores como strings
        : prevData[att]
    }));
  };

  const handleCadastro = async () => {
    cadastrar({
      name: formData.name,
      description: formData.description,
      repositoryGit: formData.repositoryGit,
      urlDoc: formData.urlDoc,
      projects: formData.projects,
      clients: formData.clients,
    }, refresh);
    onRequestClose();
  };

  const handleEdicao = async () => {
    atualizar(formData.id, {
      name: formData.name,
      description: formData.description,
      repositoryGit: formData.repositoryGit,
      urlDoc: formData.urlDoc,
      projects: formData.projects,
      clients: formData.clients,
    }, refresh);
    onRequestClose();
  };

  useEffect(() => {

    setFormData({
      id: edit?.id ?? '',
      name: edit?.name ?? '',
      description: edit?.description ?? '',
      repositoryGit: edit?.repositoryGit ?? '',
      urlDoc: edit?.urlDoc ?? '',
      clients: edit?.clients ?? [],
      projects: edit?.projects ?? []
    });

  }, [edit])

  return (
    <Modal isOpen={isOpen} className="modal" onRequestClose={() => onRequestClose()} overlayClassName="overlay">
      <button className="close" onClick={() => onRequestClose()}></button>
      <h2>Criar parceiro</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Nome:
          <input name="name" value={formData.name} onChange={(e) => handleChange(e)} className="field" type="text" required />
        </label>
        <label>
          Descrição:
          <input name="description" value={formData.description} onChange={(e) => handleChange(e)} className="field" type="text" required />
        </label>
        <label>
          Repositório GIT:
          <input name="repositoryGit" value={formData.repositoryGit} onChange={(e) => handleChange(e)} className="field" type="text" required />
        </label>
        <label>
          URL Documentação:
          < input name="urlDoc" value={formData.urlDoc} onChange={(e) => handleChange(e)} className="field" type="text" required />
        </label>
        <label>
          Projeto:
          <div>
          {formData.projects.map((item, index) => {
            return (
            <div key={index} className="item-list">
              <label>{item}</label>
              <a className="item-delete" onClick={() => handleRemoverClientesProjetos('projects', item)}> X </a>
            </div>)
          })}
          </div>
          <input name="projeto" value={projeto} onChange={(e) => setProjeto(e.target.value)} className="field" type="text" />
          <button className="btn-add" type="button" onClick={() => handleClientesProjetos('projects', projeto)}>Adicionar projeto</button>
        </label>

        <label>
          Clientes:
          <div>
          {formData.clients.map((item, index) => {
            return (
              <div key={index} className="item-list">
              <label>{item}</label>
              <a className="item-delete" onClick={() => handleRemoverClientesProjetos('clients', item)}> X </a>
            </div>)
          })}
          </div>
          <input name="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} className="field" type="text" />
          <button className="btn-add" type="button" onClick={() => handleClientesProjetos('clients', cliente)}>Adicionar cliente</button>
        </label>
        <button type="submit" className="submit-button">{edit ? 'Salvar' : 'Cadastrar'}</button>
      </form>
    </Modal>
  );
};

export default ParceiroModal;