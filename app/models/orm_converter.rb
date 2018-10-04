module OrmConverter
  require 'json'

  def self.print_orders(orders, em)
    tree = {
      :master_order => {},
      :resource => {:modality => {}},
      :procedure => {},
      :patient_mrn => {:patient => {}},
      :rad_exams => {
        :rad_exam_time => {},
        :rad_exam_personnel => {:ordering => {}},
        :procedure => {},
        :resource => {},
      },
      :ordering_provider => {}
    }
    orders.inject([]) do |list,order|
      hash = get_data(tree,order,{})
      if hash[:rad_exams] and hash[:rad_exams].size > 0
        hash[:rad_exam] = hash[:rad_exams].sort {|a,b| a["accession"] <=> b["accession"] }[0]
        hash[:rad_exams].each {|re| re.delete("accession") } #rad_exam accession deleted because of shared hash memory
      end

      hash.delete("order_number")
      list << hash
      list
    end
  end

  def self.orders(orders,em)
    tree = {
      :master_order => {},
      :resource => {:modality => {}},
      :site_class => {:patient_type => {}},
      :procedure => {},
      :current_status => {:universal_event_type => {}},
      :patient_mrn => {:patient => {}},
      :rad_exams => {
        :rad_exam_time => {},
        :rad_exam_personnel => {:ordering => {}},
        :rad_exam_detail => {},
        :procedure => {},
        :patient_mrn => {:patient => {}},
        :resource => {:modality => {}},
        :site_class => {:patient_type => {}},
        :current_status => {:universal_event_type => {}},
        :site_sublocation => {:site_location => {}},
      },
      :ordering_provider => {}
    }
    orders.inject([]) do |list,order|
      hash = get_data(tree,order,{})
      hash.merge!(ExamAdjustment.info_for(order,em))
      hash[:rad_exam] = hash[:rad_exams].sort {|a,b| a["accession"] <=> b["accession"] }[0]
      list << hash
      list
    end
  end

  def self.limited_orders(orders,em)
    tree = {
      :master_order => {},
      :resource => {:modality => {}},
      :procedure => {},
      :current_status => {:universal_event_type => {}},
      :rad_exams => {
        :rad_exam_time => {},
        :procedure => {},
        :resource => {:modality => {}},
        :current_status => {:universal_event_type => {}},
      }
    }
    orders.inject([]) do |list,order|
      hash = get_data(tree,order,{})
      hash.merge!(ExamAdjustment.info_for(order,em))
      if hash[:rad_exams] and hash[:rad_exams].size > 0
        hash[:rad_exam] = hash[:rad_exams].sort {|a,b| a["accession"] <=> b["accession"] }[0]
        hash[:rad_exams].each {|re| re.delete("accession") } #rad_exam accession deleted because of shared hash memory
      end
      hash.delete("order_number")
      list << hash
      list
    end
  end

  def self.rad_exams(exams, em)
    tree = {
      :rad_exam_time => {},
      :rad_exam_personnel => {:ordering => {}},
      :rad_exam_detail => {},
      :procedure => {},
      :patient_mrn => {:patient => {}},
      :resource => {:modality => {}},
      :site_class => {:patient_type => {}},
      :current_status => {:universal_event_type => {}},
      :site_sublocation => {:site_location => {}},
    }
    exams.inject([]) do |list, rad_exam|
      hash = get_data(tree, rad_exam, {})
      hash[:image_viewer] = JSON.parse(rad_exam.imageViewer)
      hash[:integration_json] = JSON.parse(rad_exam.integrationJson)
      list << hash
      list
    end
  end

  def self.resource(resource)
    sub_objects = {:modality => {},
                   :site => {}}
    get_data(sub_objects,resource)
  end

  def self.resources(resources)
    sub_objects = {:modality => {}}
    resources.inject([]) do |list,resource|
      list << get_data(sub_objects,resource)
      list
    end
  end

  def self.get_data(tree,obj,acc_hash={})
    if obj.respond_to?(:collect)
      obj.sort {|a,b| a.getId <=> b.getId }.collect {|o| get_data(tree,o,acc_hash) }
    else
      hash = attributes(obj)
      tree.keys.each do |key|
        if obj
          hash[key] = get_data(tree[key],obj.send(key),hash)
        end
      end
      hash
    end
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
