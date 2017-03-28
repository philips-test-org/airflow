Rails.application.routes.draw do
  get 'unauthorized' => "unauthorized#index"
  get 'main' => "main#index", :defaults => {:view => "calendar"}
  get 'exam' => "main#exam"
  get 'exams' => "main#exams"
  get 'avatar' => 'pictures#show'
  get 'about' => "main#about"
  get 'help' => "main#help"
  get 'cards' => "card_design#index"
  get 'main/:view' => "main#index"
  post 'comments/create' => "comments#create"
  root :to => redirect('main')
end
