Rails.application.routes.draw do
  get 'unauthorized' => "unauthorized#index"
  root :to => "demo#accession_search"

end
