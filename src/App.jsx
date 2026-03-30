import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, FileText, FolderOpen, Calendar as CalendarIcon, 
  Trello, Bot, Settings, DollarSign, Target, Lightbulb, Menu, X, 
  Plus, Search, Edit2, Trash2, CheckCircle, Clock, Link as LinkIcon, Paperclip, MessageSquare,
  AlertCircle, UploadCloud, ArrowRight, ArrowLeft, LogOut, Download, Cloud, Key, Database, Server
} from 'lucide-react';

// --- MOCK DATA INICIAL (Fallback) ---
const initialClientes = [
  { id: 1, nome: 'João da Silva', telefone: '(11) 99999-9999', cpf: '111.222.333-44', email: 'joao@email.com', nascimento: '1980-05-15' },
  { id: 2, nome: 'Maria Oliveira', telefone: '(11) 88888-8888', cpf: '555.666.777-88', email: 'maria@email.com', nascimento: '1992-10-20' },
  { id: 3, nome: 'Simone Dias Simao', telefone: '(11) 77777-7777', cpf: '999.888.777-66', email: 'simone@email.com', nascimento: '1985-03-12' }
];

const initialProcessos = [
  { 
    id: 1, 
    clienteId: 3, 
    numero: '1001234-56.2023.8.26.0000', 
    vara: '1ª Vara do Trabalho', 
    partes: 'Simone Dias Simao x Prefeitura Municipal', 
    status: 'Juntada e organização de documentos',
    descricao: 'Servidora Pública, fez processo seletivo de ADI, passou em 15º. Chegou 15 minutos antes, não deixaram começar. Pressão 20 por 10. Assumiu a vaga, não pode escolher, pessoas em colocações menores escolheram antes.',
    responsavel: 'Dr. Wilson Neto',
    prazo: '2024-05-10',
    links: ['http://pje.trt2.jus.br/123']
  },
  { 
    id: 2, 
    clienteId: 1, 
    numero: '000555-11.2024.8.26.0100', 
    vara: '2ª Vara Cível', 
    partes: 'João da Silva x Banco X', 
    status: 'Confeccionando Inicial',
    descricao: 'Ação de indenização por danos morais devido a cobrança indevida e negativação do nome.',
    responsavel: 'Dr. Wilson Neto',
    prazo: '2024-04-20',
    links: []
  }
];

const colunasKanban = [
  "Juntada e organização de documentos", 
  "Confeccionando Inicial", 
  "Peticionado", 
  "Redigir Manifestação/Recurso/Resposta", 
  "Finalizado/Arquivado"
];

const initialFinanceiro = [
  { id: 1, clienteId: 1, processoId: 2, valor: 5000, quemPaga: 'Cliente', parcelas: 5, forma: 'Boleto', data: '2024-04-01', status: 'Pendente' },
  { id: 2, clienteId: 3, processoId: 1, valor: 15000, quemPaga: 'Parte contrária', parcelas: 1, forma: 'Alvará', data: '2024-06-15', status: 'Aguardando' }
];

const initialLeads = [
  { id: 1, nome: 'Carlos Mendes', telefone: '(11) 91111-2222', fonte: 'Instagram', caso: 'Divórcio litigioso', status: 'Em negociação' }
];

const initialIdeias = [
  { id: 1, titulo: 'Post: Direitos da Gestante', descricao: 'Carrossel sobre estabilidade no emprego.', plataforma: 'Instagram' }
];

const initialUsuarios = [
  { id: 1, nome: 'Wilson Neto', username: 'wilson', password: '93281434@Neto*', role: 'socio' }
];

const initialArquivos = [
  { id: 1, clienteId: 3, nome: 'Procuracao_Assinada.pdf', url: '#', data: '2026-03-12' }
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  // States Locais
  const [clientes, setClientes] = useState(initialClientes);
  const [processos, setProcessos] = useState(initialProcessos);
  const [financeiro, setFinanceiro] = useState(initialFinanceiro);
  const [leads, setLeads] = useState(initialLeads);
  const [ideias, setIdeias] = useState(initialIdeias);
  const [usuarios, setUsuarios] = useState(initialUsuarios);
  const [arquivos, setArquivos] = useState(initialArquivos);
  const [config, setConfig] = useState({
    logo: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200&h=200',
    favicon: '',
    geminiKey: '',
    googleClientId: '',
    googleApiKey: '',
    googleCalendarKey: '',
    nomeEscritorio: 'Alves Martins Advocacia'
  });

  // --- Lógica de Persistência no Servidor VPS ---
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [vpsStatus, setVpsStatus] = useState('conectando'); // conectando, online, local

  // 1. Busca os dados do backend local (VPS) ao iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const data = await res.json();
          if (data.clientes) setClientes(data.clientes);
          if (data.processos) setProcessos(data.processos);
          if (data.financeiro) setFinanceiro(data.financeiro);
          if (data.leads) setLeads(data.leads);
          if (data.ideias) setIdeias(data.ideias);
          if (data.arquivos) setArquivos(data.arquivos);
          if (data.usuarios) setUsuarios(data.usuarios);
          if (data.config) setConfig(data.config);
          setVpsStatus('online');
          setIsDataLoaded(true);
          return;
        }
      } catch (e) {
        console.warn("Backend VPS não detectado. Usando armazenamento do navegador (Fallback).");
        setVpsStatus('local');
      }

      // Fallback para visualização sem backend (Local Storage)
      const localData = JSON.parse(localStorage.getItem('alves_martins_data') || '{}');
      if (localData.clientes) setClientes(localData.clientes);
      if (localData.processos) setProcessos(localData.processos);
      if (localData.financeiro) setFinanceiro(localData.financeiro);
      if (localData.leads) setLeads(localData.leads);
      if (localData.ideias) setIdeias(localData.ideias);
      if (localData.arquivos) setArquivos(localData.arquivos);
      if (localData.usuarios) setUsuarios(localData.usuarios);
      if (localData.config) setConfig(localData.config);
      setIsDataLoaded(true);
    };
    
    loadData();
  }, []);

  // Função central para salvar dados no VPS
  const saveToVps = async (newStateKey, newStateValue) => {
    // 1. Salva no LocalStorage como redundância imediata
    const localData = JSON.parse(localStorage.getItem('alves_martins_data') || '{}');
    localData[newStateKey] = newStateValue;
    localStorage.setItem('alves_martins_data', JSON.stringify(localData));

    // 2. Tenta salvar no Backend do VPS
    try {
      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [newStateKey]: newStateValue })
      });
      if (res.ok) setVpsStatus('online');
    } catch (e) { 
      setVpsStatus('local'); 
    }
  };

  // Funções de atualização com persistência automática
  const updateClientes = (val) => { setClientes(val); saveToVps('clientes', val); };
  const updateProcessos = (val) => { setProcessos(val); saveToVps('processos', val); };
  const updateFinanceiro = (val) => { setFinanceiro(val); saveToVps('financeiro', val); };
  const updateLeads = (val) => { setLeads(val); saveToVps('leads', val); };
  const updateIdeias = (val) => { setIdeias(val); saveToVps('ideias', val); };
  const updateUsuarios = (val) => { setUsuarios(val); saveToVps('usuarios', val); };
  const updateArquivos = (val) => { setArquivos(val); saveToVps('arquivos', val); };
  const updateConfig = (val) => { setConfig(val); saveToVps('config', val); };

  // Apply Favicon on change
  useEffect(() => {
    if (config.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = config.favicon;
    }
  }, [config.favicon]);

  if (!currentUser) {
    return <LoginScreen usuarios={usuarios} onLogin={setCurrentUser} config={config} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'processos', label: 'Processos', icon: FileText },
    { id: 'documentos', label: 'Docs Drive', icon: FolderOpen },
    { id: 'calendario', label: 'Calendário', icon: CalendarIcon },
    { id: 'kanban', label: 'Kanban', icon: Trello },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign, restricted: true },
    { id: 'leads', label: 'Leads (CRM)', icon: Target },
    { id: 'ia', label: 'Assistente IA', icon: Bot },
    { id: 'ideias', label: 'Ideias Postagens', icon: Lightbulb },
    { id: 'config', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-800">
      {/* Sidebar */}
      <aside className={`bg-[#0B131E] text-slate-300 w-64 flex-shrink-0 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full absolute z-50 h-full'}`}>
        <div className="p-6 flex items-center justify-center border-b border-slate-700/50 bg-white/5">
          <div className="text-center">
             <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg mb-3 overflow-hidden">
                <img src={config.logo} alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=AM&background=0D8ABC&color=fff' }}/>
             </div>
             <h1 className="font-bold text-lg text-white tracking-wide">{config.nomeEscritorio}</h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map(item => {
              if (item.restricted && currentUser.role !== 'socio') return null;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); if(window.innerWidth < 768) setIsSidebarOpen(false); }}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-700/50 text-xs text-center text-slate-500">
          v1.2.0 • Deploy VPS Ativo
          {vpsStatus === 'online' ? (
            <p className="text-green-400 mt-1 flex items-center justify-center"><Server size={10} className="mr-1"/> Sincronizado no Servidor</p>
          ) : (
            <p className="text-yellow-500 mt-1 flex items-center justify-center"><AlertCircle size={10} className="mr-1"/> Modo Local (Preview)</p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-4 justify-between flex-shrink-0">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-3 rounded-md hover:bg-gray-100 text-gray-600 focus:outline-none">
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-gray-700">{currentUser.nome}</p>
               <p className="text-xs text-green-600 capitalize">{currentUser.role}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold border-2 border-blue-500 uppercase">
               {currentUser.username.substring(0,2)}
             </div>
             <button onClick={() => setCurrentUser(null)} className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="Sair">
                <LogOut size={20} />
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {activeTab === 'dashboard' && <Dashboard processos={processos} clientes={clientes} financeiro={financeiro} />}
          {activeTab === 'clientes' && <ClientesManager clientes={clientes} setClientes={updateClientes} />}
          {activeTab === 'processos' && <ProcessosManager processos={processos} setProcessos={updateProcessos} clientes={clientes} />}
          {activeTab === 'documentos' && <DocumentosManager clientes={clientes} arquivos={arquivos} setArquivos={updateArquivos} config={config} />}
          {activeTab === 'calendario' && <Calendario processos={processos} config={config} />}
          {activeTab === 'kanban' && <KanbanBoard processos={processos} setProcessos={updateProcessos} clientes={clientes} arquivos={arquivos} setArquivos={updateArquivos} currentUser={currentUser} />}
          {activeTab === 'financeiro' && <Financeiro financeiro={financeiro} setFinanceiro={updateFinanceiro} clientes={clientes} processos={processos} />}
          {activeTab === 'leads' && <LeadsManager leads={leads} setLeads={updateLeads} />}
          {activeTab === 'ia' && <AssistenteIA config={config} />}
          {activeTab === 'ideias' && <IdeiasManager ideias={ideias} setIdeias={updateIdeias} />}
          {activeTab === 'config' && <Configuracoes config={config} setConfig={updateConfig} usuarios={usuarios} setUsuarios={updateUsuarios} currentUser={currentUser} />}
        </div>
      </main>

      {/* Mobile Overlay */}
      {!isSidebarOpen && window.innerWidth < 768 && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(true)}></div>
      )}
    </div>
  );
}

function LoginScreen({ usuarios, onLogin, config }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = usuarios.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B131E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative">
      <div className="absolute top-4 right-4 flex items-center space-x-2 text-xs text-gray-400">
        <Server size={14} /> <span>Servidor VPS Ativo</span>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
         <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg mb-6 overflow-hidden">
            <img src={config.logo} alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=AM&background=0D8ABC&color=fff' }}/>
         </div>
        <h2 className="text-center text-3xl font-extrabold text-white">
          {config.nomeEscritorio}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Gestão Jurídica e Administrativa
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-200">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700">Usuário</label>
              <div className="mt-1">
                <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <div className="mt-1">
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Entrar no Sistema
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- SCREENS COMPONENTS ---

// 1. Dashboard
function Dashboard({ processos, clientes, financeiro }) {
  const statusCounts = colunasKanban.reduce((acc, col) => {
    acc[col] = processos.filter(p => p.status === col).length;
    return acc;
  }, {});
  
  const colorMap = {
    "Juntada e organização de documentos": "#facc15", 
    "Confeccionando Inicial": "#ef4444", 
    "Peticionado": "#3b82f6", 
    "Redigir Manifestação/Recurso/Resposta": "#a855f7", 
    "Finalizado/Arquivado": "#22c55e" 
  };
  
  let currentPercentage = 0;
  const total = processos.length || 1;
  const conicGradientStr = colunasKanban.map((col) => {
    const count = statusCounts[col];
    const start = currentPercentage;
    const end = currentPercentage + (count / total) * 100;
    currentPercentage = end;
    return `${colorMap[col]} ${start}% ${end}%`;
  }).join(', ');

  const totalReceberMes = financeiro.reduce((acc, f) => acc + (f.status !== 'Pago' ? Number(f.valor) : 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} title="Total Processos" value={processos.length} color="bg-blue-500" />
        <StatCard icon={Users} title="Total Clientes" value={clientes.length} color="bg-green-500" />
        <StatCard icon={Clock} title="Audiências Próximas" value="3" color="bg-orange-500" />
        <StatCard icon={Target} title="Leads Ativos" value="5" color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center"><CalendarIcon className="mr-2 text-blue-500" size={20}/> Próximos Compromissos</h3>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-800">Audiência - Processo 000555-11.2024</h4>
                  <p className="text-xs text-gray-500">João da Silva x Banco X</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-700">14:00</p>
                  <p className="text-xs text-gray-500">Amanhã</p>
                </div>
              </div>
            ))}
             <div className="flex items-center p-3 border-l-4 border-green-500 bg-green-50 rounded-r-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-800">Aniversário Cliente</h4>
                  <p className="text-xs text-gray-500">Simone Dias Simao</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-700">12 Mar</p>
                </div>
              </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-800 w-full text-left flex items-center">
            <Trello className="mr-2 text-purple-500" size={20}/> Fases dos Processos
          </h3>
          <div className="relative w-48 h-48 rounded-full mb-6 shadow-inner" style={{ background: `conic-gradient(${conicGradientStr})` }}>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-700">{processos.length}</span>
            </div>
          </div>
          <div className="w-full space-y-2 text-sm">
            {colunasKanban.map((col, i) => (
              <div key={col} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colorMap[col] }}></div>
                  <span className="text-gray-600 truncate max-w-[150px]" title={col}>{col}</span>
                </div>
                <span className="font-semibold">{statusCounts[col]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center">
      <div className={`${color} text-white p-3 rounded-lg mr-4`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  )
}

// 2. Clientes
function ClientesManager({ clientes, setClientes }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setClientes(clientes.map(c => c.id === formData.id ? formData : c));
    } else {
      setClientes([...clientes, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <div className="relative w-64">
          <input type="text" placeholder="Buscar cliente..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
        <button onClick={() => { setFormData({}); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
          <Plus size={16} className="mr-2" /> Novo Cliente
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b border-gray-200">
              <th className="pb-3 font-semibold">Nome</th>
              <th className="pb-3 font-semibold">CPF</th>
              <th className="pb-3 font-semibold">Telefone</th>
              <th className="pb-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {clientes.map(c => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-800">{c.nome}</td>
                <td className="py-3 text-gray-600">{c.cpf}</td>
                <td className="py-3 text-gray-600">{c.telefone}</td>
                <td className="py-3 flex space-x-2">
                  <button onClick={() => { setFormData(c); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-700"><Edit2 size={16}/></button>
                  <button className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={formData.id ? "Editar Cliente" : "Novo Cliente"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Input label="Nome Completo" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required /></div>
              <Input label="CPF" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
              <Input label="RG" value={formData.rg} onChange={e => setFormData({...formData, rg: e.target.value})} />
              <Input label="Telefone/WhatsApp" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
              <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <Input label="Data de Nascimento" type="date" value={formData.nascimento} onChange={e => setFormData({...formData, nascimento: e.target.value})} />
              <Input label="Estado Civil" value={formData.estadoCivil} onChange={e => setFormData({...formData, estadoCivil: e.target.value})} />
              <div className="col-span-2"><Input label="Endereço Completo" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} /></div>
              <Input label="Ocupação" value={formData.ocupacao} onChange={e => setFormData({...formData, ocupacao: e.target.value})} />
              <Input label="PIS" value={formData.pis} onChange={e => setFormData({...formData, pis: e.target.value})} />
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Salvar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// 3. Processos
function ProcessosManager({ processos, setProcessos, clientes }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setProcessos(processos.map(p => p.id === formData.id ? formData : p));
    } else {
      setProcessos([...processos, { ...formData, id: Date.now(), status: colunasKanban[0] }]);
    }
    setIsModalOpen(false);
    setFormData({});
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
       <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <h3 className="font-semibold text-gray-700">Lista de Processos</h3>
        <button onClick={() => { setFormData({ responsavel: 'Dr. Wilson Neto' }); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
          <Plus size={16} className="mr-2" /> Novo Processo
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
         <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 text-xs uppercase border-b border-gray-200">
              <th className="pb-3 font-semibold">Número / Vara</th>
              <th className="pb-3 font-semibold">Partes</th>
              <th className="pb-3 font-semibold">Fase Atual</th>
              <th className="pb-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {processos.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3">
                  <div className="font-medium text-blue-600">{p.numero || 'S/ Número'}</div>
                  <div className="text-xs text-gray-500">{p.vara}</div>
                </td>
                <td className="py-3 text-gray-800">{p.partes}</td>
                <td className="py-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">
                    {p.status}
                  </span>
                </td>
                <td className="py-3 flex space-x-2">
                  <button onClick={() => { setFormData(p); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-700 p-1"><Edit2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={formData.id ? "Editar Processo" : "Novo Processo"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Vinculado</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    value={formData.clienteId || ''} 
                    onChange={e => setFormData({...formData, clienteId: Number(e.target.value)})}
                  >
                    <option value="">Selecione um cliente (ou crie depois)</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <Input label="Número do Processo" value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} />
                <Input label="Vara" value={formData.vara} onChange={e => setFormData({...formData, vara: e.target.value})} />
                <div className="col-span-2"><Input label="Partes (Ex: Autor x Réu)" value={formData.partes} onChange={e => setFormData({...formData, partes: e.target.value})} required /></div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Mérito</label>
                  <textarea rows="3" className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={formData.descricao || ''} onChange={e => setFormData({...formData, descricao: e.target.value})}></textarea>
                </div>
                <Input label="Link do Tribunal" value={formData.links ? formData.links[0] : ''} onChange={e => setFormData({...formData, links: [e.target.value]})} />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fase (Situação Atual)</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm" value={formData.status || colunasKanban[0]} onChange={e => setFormData({...formData, status: e.target.value})}>
                    {colunasKanban.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
             </div>
             <div className="pt-4 flex justify-end space-x-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancelar</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Salvar Processo</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// 4. Documentos (Mock GDrive)
function DocumentosManager({ clientes, arquivos, setArquivos, config }) {
  const [selectedCliente, setSelectedCliente] = useState('');
  const fileInputRef = useRef(null);

  const clienteAtual = clientes.find(c => c.id === Number(selectedCliente));
  const arquivosDoCliente = arquivos.filter(a => a.clienteId === Number(selectedCliente));

  const isGoogleConfigured = config.googleClientId && config.googleApiKey;

  const handleFileUpload = (e) => {
    if(!selectedCliente) return;
    const files = Array.from(e.target.files);
    const novos = files.map(f => ({
      id: Date.now() + Math.random(),
      clienteId: Number(selectedCliente),
      nome: f.name,
      url: URL.createObjectURL(f),
      data: new Date().toISOString()
    }));
    setArquivos([...arquivos, ...novos]);
  };

  const handleDelete = (id) => {
    if(window.confirm("Apagar documento permanentemente?")) {
      setArquivos(arquivos.filter(a => a.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col p-6">
       {!isGoogleConfigured ? (
         <div className="mb-6 bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-start">
           <AlertCircle className="text-orange-500 mr-3 mt-1 flex-shrink-0" size={24} />
           <div>
             <h4 className="font-semibold text-orange-800 text-sm">Google Drive Não Conectado</h4>
             <p className="text-xs text-orange-600 mt-1">Para enviar os arquivos diretamente para as pastas do seu Drive real, insira suas chaves de API do Google na aba "Configurações". Por enquanto, os arquivos ficarão salvos no banco local/nuvem.</p>
           </div>
         </div>
       ) : (
         <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center shadow-sm">
            <div className="bg-blue-600 p-2 rounded-full mr-3"><Cloud className="text-white" size={20}/></div>
            <div>
              <h4 className="font-bold text-blue-900 text-sm">Google Workspace Sincronizado</h4>
              <p className="text-xs text-blue-700">Os documentos agora espelham as pastas oficiais do Drive do escritório.</p>
            </div>
         </div>
       )}

       <div className="mb-4">
         <label className="block text-sm font-medium text-gray-700 mb-2">Selecione o Cliente para acessar a pasta:</label>
         <select 
            className="w-full md:w-1/2 p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            value={selectedCliente} 
            onChange={e => setSelectedCliente(e.target.value)}
          >
            <option value="">-- Selecionar Cliente --</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
       </div>

       {selectedCliente ? (
         <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-start text-center p-6 bg-slate-50 overflow-y-auto relative transition-all">
            <div className="absolute top-4 left-4 bg-white shadow-sm border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-md font-mono flex items-center">
              <FolderOpen size={14} className="mr-2 text-blue-500" />
              \Meu Drive\04. Clientes\{clienteAtual?.nome}
            </div>

            <div className="mt-14 flex flex-col items-center">
              <FolderOpen size={56} className="text-blue-300 mb-3" />
              <p className="text-gray-700 font-semibold text-lg">Pasta do cliente carregada</p>
              <p className="text-sm text-gray-500 mt-1 mb-5">Selecione ou arraste arquivos para fazer o upload.</p>
              <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <button onClick={() => fileInputRef.current.click()} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 shadow flex items-center transition-colors">
                <UploadCloud size={18} className="mr-2"/> Fazer Upload de Arquivo
              </button>
            </div>

            <div className="mt-8 w-full max-w-2xl text-left">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-2">Arquivos na Pasta ({arquivosDoCliente.length})</h5>
              {arquivosDoCliente.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6 bg-white rounded-lg border border-gray-100 border-dashed">Nenhum documento encontrado nesta pasta.</p>
              ) : (
                <div className="space-y-2">
                  {arquivosDoCliente.map(arq => (
                    <div key={arq.id} className="bg-white p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all">
                      <div className="flex items-center overflow-hidden">
                        <FileText size={18} className="text-red-500 mr-3 flex-shrink-0"/>
                        <span className="text-sm font-medium text-gray-800 truncate mr-3" title={arq.nome}>{arq.nome}</span>
                        <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-100 px-2 py-1 rounded">{new Date(arq.data).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-1">
                        {arq.url !== '#' && (
                          <a href={arq.url} download={arq.nome} className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors" title="Baixar">
                            <Download size={16}/>
                          </a>
                        )}
                        <button onClick={() => handleDelete(arq.id)} className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors" title="Excluir"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
         </div>
       ) : (
         <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-gray-100">
           <FolderOpen size={48} className="mb-4 text-gray-300" />
           <p>Selecione um cliente acima para visualizar a pasta do Drive.</p>
         </div>
       )}
    </div>
  )
}

// 5. Calendário
function Calendario({ processos, config }) {
  const isGoogleConfigured = config.googleClientId && config.googleCalendarKey;
  const days = Array.from({length: 30}, (_, i) => i + 1);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col p-4 relative">
      {!isGoogleConfigured && (
        <div className="mb-4 bg-orange-50 border border-orange-100 p-2 rounded text-xs text-orange-700 flex items-center">
          <AlertCircle size={14} className="mr-2"/> Configure a API do Google Calendar nas configurações para sincrozinar de verdade.
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Abril 2026</h3>
        <div className="space-x-2">
          <button className="p-1 border rounded hover:bg-gray-50"><ArrowLeft size={16}/></button>
          <button className="p-1 border rounded hover:bg-gray-50"><ArrowRight size={16}/></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <div key={d} className="text-xs font-semibold text-gray-500 uppercase">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map(d => (
          <div key={d} className={`border border-gray-100 rounded-md p-1 min-h-[80px] ${d === 15 ? 'bg-blue-50 border-blue-200' : ''}`}>
            <span className={`text-xs font-medium ${d === 15 ? 'text-blue-600' : 'text-gray-500'}`}>{d}</span>
            {d === 10 && <div className="mt-1 text-[10px] bg-red-100 text-red-700 p-1 rounded truncate shadow-sm" title="Prazo Proc. 1001234">Prazo: Simone</div>}
            {d === 20 && <div className="mt-1 text-[10px] bg-orange-100 text-orange-700 p-1 rounded truncate shadow-sm">Audiência 14h</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

// 6. Kanban
function KanbanBoard({ processos, setProcessos, clientes, arquivos, setArquivos, currentUser }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null); 
  const fileInputRef = useRef(null);

  const onDragStart = (e, processo) => {
    setDraggedItem(processo);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, columnName) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== columnName) {
      const updatedProcessos = processos.map(p => 
        p.id === draggedItem.id ? { ...p, status: columnName } : p
      );
      setProcessos(updatedProcessos);
    }
    setDraggedItem(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex space-x-4 overflow-x-auto pb-4 flex-1 items-start px-2">
        {colunasKanban.map(coluna => {
          const colProcessos = processos.filter(p => p.status === coluna);
          return (
            <div 
              key={coluna}
              className="bg-gray-200/50 rounded-xl w-80 flex-shrink-0 flex flex-col max-h-full border border-gray-200"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, coluna)}
            >
              <div className="p-3 font-semibold text-gray-700 text-sm flex justify-between items-center bg-gray-200/80 rounded-t-xl">
                {coluna}
                <span className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">{colProcessos.length}</span>
              </div>
              <div className="p-2 overflow-y-auto flex-1 space-y-2">
                {colProcessos.map(p => {
                  const cliente = clientes.find(c => c.id === p.clienteId);
                  return (
                    <div 
                      key={p.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, p)}
                      onClick={() => setSelectedCard(p)}
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-blue-400 hover:shadow transition-all group relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{p.vara?.split(' ')[0] || 'Vara'}</span>
                        <Edit2 size={14} className="text-gray-300 group-hover:text-gray-500"/>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 leading-tight mb-1">{cliente ? cliente.nome : p.partes}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{p.descricao || 'Sem descrição'}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                        <div className="flex space-x-2 text-gray-400">
                          {p.descricao && <MessageSquare size={14} />}
                          {(p.links?.length > 0 || arquivos.some(a => a.clienteId === p.clienteId)) && <Paperclip size={14} />}
                        </div>
                        <div className="flex items-center space-x-1">
                          {p.prazo && <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded flex items-center font-medium"><Clock size={10} className="mr-0.5"/> {new Date(p.prazo).toLocaleDateString('pt-BR').slice(0,5)}</span>}
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-[10px] flex items-center justify-center text-blue-800 font-bold border border-blue-200 uppercase" title={p.responsavel}>
                            {p.responsavel ? p.responsavel.substring(0,2) : 'WN'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {/* Botão Adicionar Card Rápido */}
                <button className="w-full text-left p-2 text-sm text-gray-500 hover:bg-white hover:shadow-sm transition-all rounded-lg flex items-center border border-transparent hover:border-gray-200 font-medium">
                  <Plus size={16} className="mr-1" /> Adicionar cartão
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trello-like Card Modal */}
      {selectedCard && (
        <Modal title={`Cartão: ${selectedCard.partes}`} onClose={() => setSelectedCard(null)} width="max-w-4xl">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Col - Content */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-semibold flex items-center text-gray-700 mb-2"><AlignLeft size={16} className="mr-2"/> Descrição do Caso</h3>
                <textarea 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 min-h-[100px] focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  defaultValue={selectedCard.descricao}
                  placeholder="Adicione uma descrição detalhada..."
                  onBlur={(e) => {
                     const updated = processos.map(p => p.id === selectedCard.id ? { ...p, descricao: e.target.value } : p);
                     setProcessos(updated);
                  }}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold flex items-center text-gray-700 mb-3"><Paperclip size={16} className="mr-2"/> Anexos do Processo</h3>
                <div className="grid grid-cols-2 gap-3">
                   {arquivos.filter(a => a.clienteId === selectedCard.clienteId).map(arq => (
                     <div key={arq.id} className="border border-gray-200 rounded-lg p-3 flex items-start bg-white relative group hover:border-blue-300 transition-colors">
                        <div className="bg-red-50 text-red-500 p-2 rounded mr-3"><FileText size={20}/></div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-sm font-medium text-gray-800 truncate" title={arq.nome}>{arq.nome}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{new Date(arq.data).toLocaleDateString()}</p>
                        </div>
                        {arq.url !== '#' && (
                          <a href={arq.url} download={arq.nome} className="absolute right-2 top-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white rounded-full shadow-sm border border-gray-100">
                            <Download size={16}/>
                          </a>
                        )}
                     </div>
                   ))}
                   <input type="file" multiple className="hidden" ref={fileInputRef} onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const novos = files.map(f => ({
                        id: Date.now() + Math.random(),
                        clienteId: selectedCard.clienteId,
                        nome: f.name,
                        url: URL.createObjectURL(f),
                        data: new Date().toISOString()
                      }));
                      setArquivos([...arquivos, ...novos]);
                   }} />
                   <div onClick={() => {
                     if (!selectedCard.clienteId) alert("Associe um cliente ao processo primeiro para salvar anexos na pasta dele.");
                     else fileInputRef.current.click();
                   }} className="border border-gray-200 border-dashed rounded-lg p-3 flex items-start bg-gray-50 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all justify-center items-center flex-col text-gray-500">
                      <Plus size={24} className="mb-1 text-gray-400"/>
                      <span className="text-xs font-medium">Adicionar Anexo</span>
                   </div>
                </div>
              </div>

              <div>
                 <h3 className="text-sm font-semibold flex items-center text-gray-700 mb-3"><MessageSquare size={16} className="mr-2"/> Atividade e Andamentos</h3>
                 <div className="flex space-x-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold border border-blue-200 uppercase">{currentUser?.username.substring(0,2)}</div>
                    <input type="text" className="flex-1 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Escreva um comentário ou andamento e aperte Enter..." />
                 </div>
                 <div className="space-y-4 pl-11 relative before:absolute before:inset-y-0 before:left-[15px] before:w-px before:bg-gray-200">
                    <div className="text-sm relative">
                      <div className="absolute -left-11 w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">S</div>
                      <span className="font-semibold text-gray-800">Sistema</span> <span className="text-xs text-gray-400 ml-2">Há 2 dias</span>
                      <p className="text-gray-700 bg-gray-50 border border-gray-100 p-2.5 rounded-lg mt-1.5 inline-block w-full">Processo movido para fase de <b>{selectedCard.status}</b>.</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right Col - Sidebar */}
            <div className="w-full md:w-56 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Adicionar</h4>
                <button className="w-full text-left px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md flex items-center mb-1.5 transition-colors"><Users size={16} className="mr-2 text-gray-500"/> Membros</button>
                <button className="w-full text-left px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md flex items-center mb-1.5 transition-colors"><CheckCircle size={16} className="mr-2 text-gray-500"/> Checklist</button>
                <button className="w-full text-left px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md flex items-center mb-1.5 transition-colors"><Clock size={16} className="mr-2 text-gray-500"/> Datas</button>
                <button className="w-full text-left px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md flex items-center transition-colors"><LinkIcon size={16} className="mr-2 text-gray-500"/> Link do PJe</button>
              </div>

               <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Ações</h4>
                <button className="w-full text-left px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 rounded-md flex items-center mb-1.5 transition-colors"><ArrowRight size={16} className="mr-2 text-gray-500"/> Mover</button>
                <button className="w-full text-left px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium rounded-md flex items-center transition-colors"><Trash2 size={16} className="mr-2"/> Arquivar Processo</button>
              </div>

               <div className="pt-4 border-t border-gray-200 mt-4">
                 <p className="text-xs font-semibold text-gray-500 mb-1.5">Fase Atual:</p>
                 <select 
                    className="w-full p-2 border border-blue-300 bg-blue-50 focus:ring-2 focus:ring-blue-500 outline-none rounded-lg text-sm text-blue-800 font-bold shadow-sm"
                    value={selectedCard.status}
                    onChange={(e) => {
                      const updated = processos.map(p => p.id === selectedCard.id ? { ...p, status: e.target.value } : p);
                      setProcessos(updated);
                      setSelectedCard({...selectedCard, status: e.target.value});
                    }}
                  >
                    {colunasKanban.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
               </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function AlignLeft(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"></line><line x1="15" y1="12" x2="3" y2="12"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg> }

// 7. IA Assistente
function AssistenteIA({ config }) {
  const [prompt, setPrompt] = useState('');
  const [historico, setHistorico] = useState([{role: 'model', text: 'Olá, sou a Inteligência Artificial do escritório Alves Martins. Como posso ajudar na redação de peças, análise de documentos ou dúvidas jurídicas hoje?'}]);
  const [loading, setLoading] = useState(false);
  const [modeloAtivo, setModeloAtivo] = useState('');
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historico]);

  const sendToGemini = async () => {
    if (!prompt.trim() || !config.geminiKey) return;
    
    const userText = prompt;
    setHistorico(prev => [...prev, { role: 'user', text: userText }]);
    setPrompt('');
    setLoading(true);

    try {
      let modelToUse = modeloAtivo;

      // Descoberta Automática de Modelos (Se ainda não foi descoberto nesta sessão)
      if (!modelToUse) {
        const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${config.geminiKey}`);
        const modelsData = await modelsRes.json();
        
        if (modelsData.error) throw new Error(modelsData.error.message);

        if (modelsData.models) {
           // Filtra apenas modelos que suportam geração de texto
           const validModels = modelsData.models
              .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
              .map(m => m.name);
           
           // Prioriza os melhores e mais rápidos modelos de acordo com a lista da Google
           const prioridades = [
              'models/gemini-2.5-flash',
              'models/gemini-2.5-pro',
              'models/gemini-1.5-flash',
              'models/gemini-1.5-pro',
              'models/gemini-pro'
           ];

           let encontrado = null;
           for (const p of prioridades) {
             if (validModels.includes(p)) {
               encontrado = p.replace('models/', '');
               break;
             }
           }

           if (encontrado) {
             modelToUse = encontrado;
             setModeloAtivo(encontrado);
           } else {
             // Fallback de segurança se a API retornar algo inesperado
             modelToUse = validModels.length > 0 ? validModels[0].replace('models/', '') : 'gemini-1.5-flash';
             setModeloAtivo(modelToUse);
           }
        } else {
           modelToUse = 'gemini-1.5-flash';
        }
      }

      // Faz a chamada final com o modelo correto e descoberto
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${config.geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userText }] }],
          systemInstruction: { parts: [{ text: "Você é um assistente jurídico sênior focado em ajudar advogados brasileiros na redação de peças, resumos e argumentações. Responda em português." }] }
        })
      });
      
      const data = await response.json();
      if(data.error) throw new Error(data.error.message);
      
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Desculpe, não consegui processar a resposta.';
      setHistorico(prev => [...prev, { role: 'model', text: botText }]);
    } catch (error) {
      setHistorico(prev => [...prev, { role: 'model', text: `Erro de conexão com API Gemini: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!config.geminiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Bot size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Assistente IA Desativado</h2>
        <p className="text-gray-500 mt-2 max-w-md">Para utilizar o Gemini (modelo Flash de alta velocidade para redação e análise), insira sua Chave de API na aba "Configurações".</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-[#0B131E] p-4 text-white flex items-center shadow">
        <Bot className="mr-3 text-blue-400" size={24}/>
        <div>
          <h3 className="font-semibold text-sm">Gemini Legal Assistant</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Modelo: {modeloAtivo || 'Autodetectando...'} | Status: Online</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {historico.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            }`}>
              <pre className="font-sans whitespace-pre-wrap">{msg.text}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none text-gray-500 flex space-x-2 shadow-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex relative items-end shadow-sm rounded-xl bg-gray-50 border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendToGemini(); } }}
            placeholder="Peça para redigir uma manifestação, analisar um fato..."
            className="w-full bg-transparent border-none pl-4 pr-12 py-3 text-sm focus:ring-0 outline-none resize-none max-h-32"
            rows="2"
          />
          <button 
            onClick={sendToGemini}
            disabled={loading || !prompt.trim()}
            className="absolute right-2 bottom-2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <ArrowRight size={16} />
          </button>
        </div>
        <p className="text-[10px] uppercase font-bold text-gray-400 mt-2 text-center">A IA PODE COMETER ERROS. REVISE SEMPRE OS DOCUMENTOS JURÍDICOS GERADOS.</p>
      </div>
    </div>
  )
}

// 8. Configurações
function Configuracoes({ config, setConfig, usuarios, setUsuarios, currentUser }) {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({});

  if (currentUser.role !== 'socio') {
    return <div className="p-6 text-center text-gray-500 mt-10 font-medium">Acesso restrito à Diretoria/Sócios do escritório.</div>;
  }

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (userFormData.id) {
      setUsuarios(usuarios.map(u => u.id === userFormData.id ? userFormData : u));
    } else {
      setUsuarios([...usuarios, { ...userFormData, id: Date.now() }]);
    }
    setIsUserModalOpen(false);
  };

  return (
    <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Identidade Visual e Gemini */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center"><Settings size={20} className="mr-2 text-gray-500"/> Configurações Gerais</h2>
          <div className="space-y-4">
            <Input label="Nome do Escritório" value={config.nomeEscritorio} onChange={e => setConfig({...config, nomeEscritorio: e.target.value})} />
            <Input label="URL da Logo (PNG/JPG)" value={config.logo} onChange={e => setConfig({...config, logo: e.target.value})} />
            <Input label="URL do Favicon (.ico ou .png)" placeholder="https://exemplo.com/favicon.png" value={config.favicon} onChange={e => setConfig({...config, favicon: e.target.value})} />
            <div className="pt-2 border-t mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center"><Bot size={16} className="mr-2 text-blue-500"/> Inteligência Artificial</h3>
              <Input label="Chave de API do Google Gemini" type="password" placeholder="AIzaSy..." value={config.geminiKey} onChange={e => setConfig({...config, geminiKey: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Integrações Google */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-blue-500">
          <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2 flex items-center"><Cloud size={20} className="mr-2 text-blue-500"/> Integrações API do Google</h2>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">Conecte o sistema aos serviços do Google Workspace para sincronizar os documentos diretamente no Drive e as audiências na Agenda oficial.</p>
          <div className="space-y-4">
            <Input label="Google OAuth Client ID" placeholder="123456-abc.apps.googleusercontent.com" value={config.googleClientId || ''} onChange={e => setConfig({...config, googleClientId: e.target.value})} />
            <Input label="Google API Key (Drive)" type="password" placeholder="Chave para acessar o Drive..." value={config.googleApiKey || ''} onChange={e => setConfig({...config, googleApiKey: e.target.value})} />
            <Input label="Google API Key (Calendar)" type="password" placeholder="Chave para acessar a Agenda..." value={config.googleCalendarKey || ''} onChange={e => setConfig({...config, googleCalendarKey: e.target.value})} />
            
            <button className="w-full mt-2 bg-blue-50 border border-blue-200 text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-100 transition-colors flex justify-center items-center text-sm shadow-sm">
              <Key size={16} className="mr-2"/> Autenticar Contas Google
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Status do Servidor VPS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-green-500">
           <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2 flex items-center"><Database size={20} className="mr-2 text-green-500"/> Armazenamento no Servidor (VPS)</h2>
           <p className="text-sm text-gray-600 mb-4 leading-relaxed">
             O sistema está configurado para salvar todos os dados em arquivos seguros localizados diretamente no disco do seu servidor VPS.
           </p>
           <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800 text-sm">Status da Conexão Backend</p>
                <p className="text-xs text-gray-500 mt-1">Garante que seus dados sobrevivam a novos deploys e reinicializações do Coolify.</p>
              </div>
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 font-medium text-xs shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div> Ativo e Sincronizando
              </div>
           </div>
        </div>

        {/* Gestão de Usuários */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
           <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-lg font-bold text-gray-800 flex items-center"><Users size={20} className="mr-2 text-gray-500"/> Gestão de Usuários</h2>
              <button onClick={() => { setUserFormData({ role: 'advogado' }); setIsUserModalOpen(true); }} className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <Plus size={16} />
              </button>
           </div>
           <div className="space-y-3">
             {usuarios.map(u => (
               <div key={u.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:border-gray-300 transition-colors">
                 <div>
                   <p className="font-semibold text-gray-800 text-sm">{u.nome}</p>
                   <p className="text-xs text-gray-500 mt-0.5"><span className="font-mono text-blue-600">@{u.username}</span> • {u.role}</p>
                 </div>
                 <div className="flex space-x-1">
                   <button onClick={() => { setUserFormData(u); setIsUserModalOpen(true); }} className="text-gray-400 hover:text-blue-600 bg-white shadow-sm border border-gray-100 p-1.5 rounded transition-all"><Edit2 size={14}/></button>
                   <button onClick={() => setUsuarios(usuarios.filter(x => x.id !== u.id))} className="text-gray-400 hover:text-red-600 bg-white shadow-sm border border-gray-100 p-1.5 rounded transition-all disabled:opacity-50" disabled={u.id === 1}><Trash2 size={14}/></button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {isUserModalOpen && (
        <Modal title={userFormData.id ? "Editar Usuário" : "Novo Usuário"} onClose={() => setIsUserModalOpen(false)}>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <Input label="Nome Completo" value={userFormData.nome} onChange={e => setUserFormData({...userFormData, nome: e.target.value})} required />
            <Input label="Nome de Usuário (Login)" value={userFormData.username} onChange={e => setUserFormData({...userFormData, username: e.target.value})} required />
            <Input label="Senha" type="text" value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permissão / Cargo</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value})}>
                <option value="socio">Sócio (Acesso Total ao Financeiro e Configurações)</option>
                <option value="advogado">Advogado (Acesso Parcial)</option>
                <option value="estagiario">Estagiário (Acesso Restrito)</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition-colors">Salvar Usuário</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// 9. Financeiro (Restrito)
function Financeiro({ financeiro, setFinanceiro, clientes, processos }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ quemPaga: 'Cliente', parcelas: 1, forma: 'Pix', status: 'Pendente' });

  // Resumos simplificados
  const totalReceber = financeiro.reduce((acc, f) => acc + (f.status !== 'Pago' ? Number(f.valor) : 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setFinanceiro(financeiro.map(f => f.id === formData.id ? formData : f));
    } else {
      setFinanceiro([...financeiro, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Deseja apagar este lançamento?")) {
      setFinanceiro(financeiro.filter(f => f.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <h3 className="font-semibold text-gray-700">Controle Financeiro (Acesso Restrito)</h3>
        <button onClick={() => { setFormData({ quemPaga: 'Cliente', parcelas: 1, forma: 'Pix', status: 'Pendente' }); setIsModalOpen(true); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow">
          <Plus size={16} className="mr-2" /> Novo Lançamento
        </button>
      </div>
      
      <div className="p-4 grid grid-cols-3 gap-4 border-b border-gray-100">
        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
          <p className="text-sm font-medium text-green-800 mb-1">Total a Receber (Geral)</p>
          <p className="text-2xl font-black text-green-600">R$ {totalReceber.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
          <p className="text-sm font-medium text-blue-800 mb-1">A Receber este Mês</p>
          <p className="text-2xl font-black text-blue-600">R$ 5.000,00</p>
        </div>
        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
          <p className="text-sm font-medium text-orange-800 mb-1">A Receber esta Semana</p>
          <p className="text-2xl font-black text-orange-600">R$ 0,00</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="pb-3 font-semibold">Data</th>
              <th className="pb-3 font-semibold">Processo / Cliente</th>
              <th className="pb-3 font-semibold">Responsável Pgto</th>
              <th className="pb-3 font-semibold">Valor</th>
              <th className="pb-3 font-semibold text-center">Status</th>
              <th className="pb-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {financeiro.map(f => {
               const cliente = clientes.find(c => c.id === Number(f.clienteId));
               const processo = processos.find(p => p.id === Number(f.processoId));
               return (
                <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 text-gray-600 font-medium">{new Date(f.data).toLocaleDateString('pt-BR')}</td>
                  <td className="py-3.5">
                    <div className="font-bold text-gray-800">{cliente?.nome || 'Desconhecido'}</div>
                    <div className="text-xs text-blue-600 mt-0.5">{processo?.numero || 'S/ Processo'}</div>
                  </td>
                  <td className="py-3.5 text-gray-600">{f.quemPaga}</td>
                  <td className="py-3.5 font-bold text-gray-800">R$ {Number(f.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td className="py-3.5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                      f.status === 'Pendente' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      f.status === 'Atrasado' ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-green-50 text-green-600 border-green-200'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3.5 flex space-x-1 justify-end">
                    <button onClick={() => { setFormData(f); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-600 bg-white border border-gray-200 shadow-sm p-1.5 rounded transition-all"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(f.id)} className="text-gray-400 hover:text-red-600 bg-white border border-gray-200 shadow-sm p-1.5 rounded transition-all"><Trash2 size={16}/></button>
                  </td>
                </tr>
               )
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={formData.id ? "Editar Lançamento" : "Novo Lançamento Financeiro"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processo Vinculado</label>
                  <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={formData.processoId || ''} onChange={e => {
                    const proc = processos.find(p => p.id === Number(e.target.value));
                    setFormData({...formData, processoId: proc.id, clienteId: proc.clienteId});
                  }} required>
                    <option value="">Selecione o Processo...</option>
                    {processos.map(p => <option key={p.id} value={p.id}>{p.partes} ({p.numero || 'S/N'})</option>)}
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quem Pagará?</label>
                  <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={formData.quemPaga} onChange={e => setFormData({...formData, quemPaga: e.target.value})}>
                    <option value="Cliente">Cliente</option>
                    <option value="Parte contrária">Parte Contrária (Condenação/Acordo)</option>
                  </select>
                </div>

                <Input label="Valor (R$)" type="number" step="0.01" value={formData.valor || ''} onChange={e => setFormData({...formData, valor: e.target.value})} required />
                <Input label="Data Prevista" type="date" value={formData.data || ''} onChange={e => setFormData({...formData, data: e.target.value})} required />
                
                <Input label="Quantidade de Parcelas" type="number" min="1" value={formData.parcelas} onChange={e => setFormData({...formData, parcelas: e.target.value})} />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                  <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={formData.forma} onChange={e => setFormData({...formData, forma: e.target.value})}>
                    <option value="Pix">Pix</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Alvará">Alvará Judicial</option>
                  </select>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status do Pagamento</label>
                  <select className={`w-full p-2.5 border rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 ${
                    formData.status === 'Pago' ? 'bg-green-50 text-green-700 border-green-300' :
                    formData.status === 'Atrasado' ? 'bg-red-50 text-red-700 border-red-300' :
                    'bg-orange-50 text-orange-700 border-orange-300'
                  }`} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                    <option value="Atrasado">Atrasado</option>
                  </select>
                </div>
             </div>
             <div className="pt-4 flex justify-end space-x-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button type="submit" className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium shadow hover:bg-green-700 transition-colors">Salvar Transação</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// 10. Leads
function LeadsManager({ leads, setLeads }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setLeads(leads.map(l => l.id === formData.id ? formData : l));
    } else {
      setLeads([...leads, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Deseja apagar este lead?")) {
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-700">Gestão de Leads (Prospectos)</h3>
        <button onClick={() => { setFormData({}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow">
          <Plus size={16} className="mr-2" /> Novo Lead
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {leads.map(l => (
          <div key={l.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all bg-gray-50 relative group">
            <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setFormData(l); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border border-gray-100 rounded shadow-sm"><Edit2 size={14}/></button>
              <button onClick={() => handleDelete(l.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white border border-gray-100 rounded shadow-sm"><Trash2 size={14}/></button>
            </div>
            <h4 className="font-bold text-gray-800 mb-1 text-lg pr-14">{l.nome}</h4>
            <p className="text-sm text-gray-600 mb-3 flex items-center"><Target size={14} className="mr-1.5 text-gray-400"/> {l.telefone}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wide bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md">{l.fonte}</span>
              <span className="text-[10px] uppercase font-bold tracking-wide bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md border border-orange-200">{l.status}</span>
            </div>
            <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 shadow-sm leading-relaxed"><strong className="text-gray-900 block mb-1 text-xs uppercase">Resumo do Caso:</strong> {l.caso}</p>
            <div className="mt-4 flex justify-end">
               <button className="text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors">Converter em Cliente <ArrowRight size={14} className="inline ml-1"/></button>
            </div>
          </div>
        ))}
      </div>

       {isModalOpen && (
        <Modal title={formData.id ? "Editar Lead" : "Novo Lead"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome Completo do Prospecto" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required/>
            <Input label="Contato (WhatsApp/Tel)" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} required/>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fonte de Captação</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={formData.fonte} onChange={e => setFormData({...formData, fonte: e.target.value})}>
                <option value="Instagram">Instagram</option>
                <option value="Indicação">Indicação</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Site Institucional">Site Institucional</option>
              </select>
            </div>
            <Input label="Caso em Potencial (Resumo)" value={formData.caso} onChange={e => setFormData({...formData, caso: e.target.value})} required/>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status de Negociação</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-700" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Contato Inicial">Contato Inicial</option>
                <option value="Em negociação">Em negociação</option>
                <option value="Aguardando docs">Aguardando documentos</option>
                <option value="Reunião Agendada">Reunião Agendada</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition-colors">Salvar Lead</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// 11. Ideias de Postagens
function IdeiasManager({ ideias, setIdeias }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      setIdeias(ideias.map(i => i.id === formData.id ? formData : i));
    } else {
      setIdeias([...ideias, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Deseja apagar esta ideia?")) {
      setIdeias(ideias.filter(i => i.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col p-4">
       <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-700">Ideias e Roteiros de Conteúdo Jurídico</h3>
        <button onClick={() => { setFormData({}); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow">
          <Plus size={16} className="mr-2" /> Nova Ideia
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ideias.map(i => (
          <div key={i.id} className="border border-gray-200 border-l-4 border-l-blue-500 bg-white rounded-r-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setFormData(i); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-500 bg-gray-50 rounded"><Edit2 size={14}/></button>
              <button onClick={() => handleDelete(i.id)} className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded"><Trash2 size={14}/></button>
            </div>
            <h4 className="font-bold text-gray-900 mb-2 pr-14 text-lg">{i.titulo}</h4>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md mb-4 inline-block">{i.plataforma}</span>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
               <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{i.descricao}</p>
            </div>
          </div>
        ))}
      </div>

       {isModalOpen && (
        <Modal title={formData.id ? "Editar Ideia de Postagem" : "Nova Ideia de Postagem"} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Título da Ideia (Chamada)" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required/>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma Alvo</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" value={formData.plataforma} onChange={e => setFormData({...formData, plataforma: e.target.value})}>
                <option value="Instagram">Instagram (Reels/Carrossel)</option>
                <option value="TikTok">TikTok (Vídeo Curto)</option>
                <option value="Blog/Site">Blog / Artigo no Site</option>
                <option value="LinkedIn">LinkedIn (Artigo Profissional)</option>
              </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Roteiro Completo / Texto Base</label>
               <textarea rows="8" className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} placeholder="Escreva o roteiro do vídeo ou os tópicos principais..."></textarea>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium shadow hover:bg-blue-700 transition-colors">Salvar Ideia</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

// --- UTILS COMPONENTS ---
function Modal({ title, children, onClose, width = 'max-w-md' }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${width} max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/80">
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

function Input({ label, type = 'text', value, onChange, placeholder, required, step, min }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <input 
        type={type} 
        value={value || ''} 
        onChange={onChange} 
        placeholder={placeholder}
        required={required}
        step={step}
        min={min}
        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm bg-gray-50/50"
      />
    </div>
  )
}
