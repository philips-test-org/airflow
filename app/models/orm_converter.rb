module OrmConverter


  def self.exam_with_comment(employee,comment)
    {employee_id: employee.getId,
     employee: {name: employee.name},
     created_at: Time.now.to_i*1000,
     comment: comment}
  end

  # def self.exam_modal(exam)
  #   tree = {:rad_exam_time => {},
  #           :rad_exam_personnel => {},
  #           :rad_exam_detail => {},
  #           :procedure => {},
  #           :patient_mrn => {:patient => {}},
  #           :resource => {:modality => {}},
  #           :site_class => {:patient_type => {}}
  #          }
  #   hash = get_data(tree,exam)
  #   hash[:comments] = [{employee_id: 1,
  #                       employee: {name: "Bill Everyman"},
  #                       created_at: Time.now.to_i*1000,
  #                       comment: "This is a test comment from a test user. It is entirely fake and generated for every exam I click"}]
  #   hash[:paperwork] = true
  #   hash[:consent] = false
  #   hash[:anesthesia] = true
  #   hash
  # end

  def self.exams(exams)
    tree = {:rad_exam_time => {},
            :rad_exam_personnel => {},
            :rad_exam_detail => {},
            :procedure => {},
            :patient_mrn => {:patient => {}},
            :resource => {:modality => {}},
            :site_class => {:patient_type => {}},
            :site_sublocation => {:site_location => {}}
           }
    exams.inject([]) do |list,exam|
      hash = get_data(tree,exam,{})
      hash[:paperwork] = true
      hash[:consent] = false
      hash[:anesthesia] = true
      hash[:comments] = [{employee_id: 1,
                          employee: {name: "Bill Everyman"},
                          created_at: Time.now.to_i*1000,
                          comment: "This is a test comment from a test user. It is entirely fake and generated for every exam I click"}]
      list << hash
      list
    end
  end

  def self.resources(resources)
    sub_objects = {:modality => {}}
    resources.inject([]) do |list,resource|
      list << get_data(sub_objects,resource)
      list
    end
  end

  def self.get_data(tree,obj,acc_hash={})
    hash = attributes(obj)
    tree.keys.each do |key|
      if obj
        hash[key] = get_data(tree[key],obj.send(key),hash)
      end        
    end
    hash
  end

  def self.attributes(obj)
    if obj
      obj.class.tableData.keys.delete_if {|k| k =~ /^ref\:/ }.inject({}) do |hash,attr|
        value = obj.send(attr)
        klass = value.class
        if klass == Java::JavaSql::Timestamp
          hash[attr] = value.getTime
        elsif klass == Java::JavaSql::Date
          hash[attr] = value.to_s
        else
          hash[attr] = value
        end
        hash
      end
    else
      {}
    end
  end

end
