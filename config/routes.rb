Rails.application.routes.draw do
  get 'unauthorized' => "unauthorized#index"
  get 'main' => "main#index", :defaults => {:view => "calendar"}
  get 'kiosk' => "kiosk#index"
  get 'exams/kiosk' => "kiosk#exams"
  get 'exam' => "main#exam"
  get 'exams' => "exams#index"
  get 'exam_info' => "exams#show"
  get "avatar/:id", to: 'avatars#show', as: "avatar"
  get 'about' => "main#about"
  get 'help' => "main#help"
#  get 'cards' => "card_design#index"
  get 'main/:view' => "main#index"
  post "events", to: "events#create"

  get 'resource_groups' => 'resource_groups#index'
  get 'resource_groups/search' => 'resource_groups#search'
  post 'resource_groups/create' => 'resource_groups#create'
  post 'resource_groups/delete' => 'resource_groups#delete'
  post 'resource_groups/associate' => 'resource_groups#associate'
  post 'resource_groups/disassociate' => 'resource_groups#disassociate'

  get 'admin/site-configuration' => 'admin#site_configuration'
  put 'admin/save_config' => 'admin#save_config'

  root :to => redirect('main')
end
