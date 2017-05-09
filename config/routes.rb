Rails.application.routes.draw do
  get 'unauthorized' => "unauthorized#index"
  get 'main' => "main#index", :defaults => {:view => "calendar"}
  get 'kiosk' => "main#kiosk", :defaults => {:view => "kiosk"}
  get 'exam' => "main#exam"
  get 'exams' => "main#exams"
  get 'exam_info' => "main#exam_info"
  get 'avatar' => 'pictures#show'
  get 'about' => "main#about"
  get 'help' => "main#help"
  get 'cards' => "card_design#index"
  get 'main/:view' => "main#index"
  post 'events/add' => "events#add"

  get 'admin/site-configuration' => 'admin#site_configuration'
  put 'admin/save_config' => 'admin#save_config'

  root :to => redirect('main')
end
