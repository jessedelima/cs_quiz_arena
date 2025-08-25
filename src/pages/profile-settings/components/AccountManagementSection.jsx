import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AccountManagementSection = ({ 
  onDataExport = () => {},
  onAccountDeletion = () => {}
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    understand: false,
    confirmText: '',
    finalConfirm: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleDataExport = async (type) => {
    setIsExporting(true);
    try {
      await onDataExport(type);
      // Simulate export process
      setTimeout(() => {
        setIsExporting(false);
      }, 3000);
    } catch (error) {
      setIsExporting(false);
    }
  };

  const handleDeleteConfirmationChange = (field, value) => {
    setDeleteConfirmation(prev => ({ ...prev, [field]: value }));
  };

  const canProceedWithDeletion = () => {
    return deleteConfirmation?.understand && 
           deleteConfirmation?.confirmText?.toLowerCase() === 'excluir minha conta' &&
           deleteConfirmation?.finalConfirm;
  };

  const handleAccountDeletion = () => {
    if (canProceedWithDeletion()) {
      onAccountDeletion();
    }
  };

  const mockAccountStats = {
    accountCreated: new Date('2023-06-15'),
    totalQuizzes: 127,
    totalWins: 43,
    coinsEarned: 15420,
    itemsTraded: 28,
    dataSize: '2.4 MB'
  };

  return (
    <div className="space-y-6">
      {/* Account Statistics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          <span>Estatísticas da Conta</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <Icon name="Calendar" size={24} color="var(--color-accent)" className="mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {Math.floor((new Date() - mockAccountStats?.accountCreated) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-muted-foreground">Dias ativo</div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <Icon name="Gamepad2" size={24} color="var(--color-primary)" className="mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{mockAccountStats?.totalQuizzes}</div>
            <div className="text-sm text-muted-foreground">Quizzes jogados</div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <Icon name="Trophy" size={24} color="var(--color-warning)" className="mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{mockAccountStats?.totalWins}</div>
            <div className="text-sm text-muted-foreground">Vitórias</div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <Icon name="Coins" size={24} color="var(--color-success)" className="mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {mockAccountStats?.coinsEarned?.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Moedas ganhas</div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <Icon name="ArrowRightLeft" size={24} color="var(--color-accent)" className="mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{mockAccountStats?.itemsTraded}</div>
            <div className="text-sm text-muted-foreground">Itens trocados</div>
          </div>

          <div className="text-center p-4 bg-muted rounded-lg">
            <Icon name="Database" size={24} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{mockAccountStats?.dataSize}</div>
            <div className="text-sm text-muted-foreground">Dados armazenados</div>
          </div>
        </div>
      </div>
      {/* Data Export */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Download" size={20} color="var(--color-accent)" />
          <span>Exportar Dados</span>
        </h3>

        <div className="space-y-4">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-accent font-medium mb-1">Seus direitos de dados:</p>
                <p className="text-muted-foreground">
                  De acordo com a LGPD, você tem o direito de solicitar uma cópia de todos os seus dados pessoais 
                  armazenados em nossa plataforma. Os dados serão fornecidos em formato JSON.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="User" size={20} color="var(--color-primary)" />
                <h4 className="font-medium text-foreground">Dados do Perfil</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Informações pessoais, configurações e preferências da conta
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDataExport('profile')}
                loading={isExporting}
                fullWidth
              >
                <Icon name="Download" size={16} />
                Exportar Perfil
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="Gamepad2" size={20} color="var(--color-warning)" />
                <h4 className="font-medium text-foreground">Histórico de Jogos</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Todas as partidas jogadas, pontuações e estatísticas
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDataExport('games')}
                loading={isExporting}
                fullWidth
              >
                <Icon name="Download" size={16} />
                Exportar Jogos
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="ArrowRightLeft" size={20} color="var(--color-success)" />
                <h4 className="font-medium text-foreground">Transações</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Histórico completo de trocas, depósitos e saques
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDataExport('transactions')}
                loading={isExporting}
                fullWidth
              >
                <Icon name="Download" size={16} />
                Exportar Transações
              </Button>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name="Package" size={20} color="var(--color-accent)" />
                <h4 className="font-medium text-foreground">Dados Completos</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Arquivo completo com todos os seus dados da plataforma
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleDataExport('complete')}
                loading={isExporting}
                fullWidth
              >
                <Icon name="Download" size={16} />
                Exportar Tudo
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Account Deletion */}
      <div className="bg-card border border-destructive/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Trash2" size={20} color="var(--color-destructive)" />
          <span>Excluir Conta</span>
        </h3>

        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-destructive)" className="flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-destructive font-medium mb-1">Atenção: Esta ação é irreversível!</p>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Todos os seus dados serão permanentemente excluídos</li>
                  <li>Seu histórico de jogos e estatísticas será perdido</li>
                  <li>Moedas e itens não poderão ser recuperados</li>
                  <li>Você não poderá usar o mesmo email novamente</li>
                  <li>Todas as transações pendentes serão canceladas</li>
                </ul>
              </div>
            </div>
          </div>

          {!showDeleteConfirmation ? (
            <div className="flex justify-center">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                <Icon name="Trash2" size={16} />
                Solicitar Exclusão da Conta
              </Button>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-destructive/5 border border-destructive/10 rounded-lg">
              <h4 className="font-medium text-foreground">Confirmação de Exclusão</h4>
              
              <div className="space-y-3">
                <Checkbox
                  label="Eu entendo que esta ação é irreversível e todos os meus dados serão perdidos"
                  checked={deleteConfirmation?.understand}
                  onChange={(e) => handleDeleteConfirmationChange('understand', e?.target?.checked)}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Digite "excluir minha conta" para confirmar:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmation?.confirmText}
                    onChange={(e) => handleDeleteConfirmationChange('confirmText', e?.target?.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
                    placeholder="excluir minha conta"
                  />
                </div>

                <Checkbox
                  label="Confirmo que desejo excluir permanentemente minha conta"
                  checked={deleteConfirmation?.finalConfirm}
                  onChange={(e) => handleDeleteConfirmationChange('finalConfirm', e?.target?.checked)}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="destructive"
                  onClick={handleAccountDeletion}
                  disabled={!canProceedWithDeletion()}
                >
                  <Icon name="Trash2" size={16} />
                  Excluir Conta Permanentemente
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setDeleteConfirmation({ understand: false, confirmText: '', finalConfirm: false });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagementSection;